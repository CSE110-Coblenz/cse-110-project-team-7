import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { BossGameScreenModel } from "./BossGameScreenModel.ts";
import { BossGameScreenView } from "./BossGameScreenView.ts";
import { BossEnemyModel } from "../../models/BossEnemyModel.ts";
import type { Tile } from "./Tile.ts";
import type { EquationMode } from "../BasicGameScreen/BasicGameScreenModel.ts";
import { spawnEnemy } from "../../utils/enemyFactory.ts";
import { evaluate } from "../../utils/equationSolver.ts";
import { GlobalPlayer } from "../../GlobalPlayer.ts"; //used for non-health and score operations
import Konva from "konva";

/**
 * BossGameScreenController - Coordinates game logic between Model and View
 */
export class BossGameScreenController extends ScreenController {
	private boss: BossEnemyModel;
	private model: BossGameScreenModel;
	private view: BossGameScreenView;
	private screenSwitcher: ScreenSwitcher;
	private gameTimer: number | null = null;
	equationMode: EquationMode;
	private tileSet = new Set<Tile>();

	tower: number = 1;
	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;
		this.model = new BossGameScreenModel();
		this.view = new BossGameScreenView();
		this.equationMode = this.getEquationModeForTower(this.tower);
		console.log(this.equationMode)
		this.view.setOnTileEntry((tile: Tile) => {
			this.addTile(tile);
		});

		this.view.setOnTileRemoval((tile: Tile) => {
			this.removeTile(tile)
		});

		this.view.setOnSubmitPress((_: Konva.Rect) => {
			console.log("SUBMIT PRESSED")
			this.checkSubmit();
		});

		this.boss = this.spawnBoss();

		// Pause functionality
		this.view.setOnPauseClick(() => {
			this.togglePause();
		});

		this.view.setOnQuitClick(() => {
			this.returnToTowerSelect();
		});
	}

	private spawnBoss(): BossEnemyModel {
		return spawnEnemy('boss', 1, this.equationMode) as BossEnemyModel;
	}

	getEquationModeForTower(tower: number): EquationMode {
		switch (tower) {
			case 1:
				return "addition";
			case 2:
				return "subtraction";
			case 3:
				return "multiplication";
			case 4:
				return "division";
			case 5:
			default:
				return "any";
		}
	}
	/**
	 * Get the view group
	 */
	getView(): BossGameScreenView {
		return this.view;
	}

	/**
	 * Start the game
	 */
	startGame(): void {
		// Reset model state
		this.model.resetTimer();
		this.boss.reset();

		this.loadPhaseIntoView();
		this.view.hideGameOver();
		this.view.hidePauseOverlay();
		this.view.show();
		this.view.updateHealth(this.model.get_health());
		this.view.updateScore(this.model.getScore());
		this.startTimer();
	}

	/* 
		Each boss in the game has an associated target, and tiles to choose from
		for each phase, we change the target number, the image 
		(if there is a difference), the phase's tiles, and clears the equation.
	*/
	private loadPhaseIntoView() {
		const phase = this.boss.getCurrentPhase();

		this.view.updateBossNum(phase.targetNumber.toString());
		this.view.updateBossImage(phase.imagePath);
		this.view.updatePhaseTiles(phase.tiles);
		this.view.updateEquationText("");
		this.view.hideGameOver(); //in case they are coming back from a death
		this.view.hidePauseOverlay(); // in case they are unpausing
	}

	/* 
		checkSubmit() - if it equals the target number, it gose through adding to 
		score, flashing green, etc. if it is NOT in its final phase, it loads 
		the next phase in tiles and target numbers via loadPhaseintoview().
		If it is the last phase, it gets sent to tower select screen.

		if an equation is failed, it falshes red, subtracts from score, updates,
		but doesn't change the tiles. it then handles death if this is the last
		straw.
	*/
	checkSubmit(): void {
		if (this.checkEQ()) {
			this.view.flashEquationGreen();
			this.model.addScore(10);
			this.view.updateScore(this.model.getScore());
			// Advance to next phase - if boss was not in its final phase
			if (!this.boss.isFinalPhase()) {
				this.boss.nextPhase();
				this.tileSet.clear(); // Clear current tile selections
				this.loadPhaseIntoView();
				this.model.resetTimer();
			} else {
				// End game if final phase completed
				if (this.tower === GlobalPlayer.get_highest_tower()) {
					GlobalPlayer.unlock_next_tower();
					this.saveProgressToBackend(this.tower)
				}
				this.tileSet.clear();
				this.screenSwitcher.switchToScreen({ type: 'tower_select' })
				this.endGame();
			}
		} else {
			console.log("equation failed");
			this.view.flashEquationRed();
			this.model.subtractScore(7);
			this.view.updateScore(this.model.getScore());
			this.view.updateHealth(this.model.take_damage(1));
			if (this.model.get_health() <= 0) {
				this.handleDeath();
			}
		}
	}

	/* 
		RemoveTile: Handle when a tile is removed from the set. 
		A removal could also make an invalid equation into a valid one, so the user 
		could press submit here 
	*/
	removeTile(tile: Tile): void {
		this.tileSet.delete(tile);
		const eq = this.makeEquation();
		this.view.updateEquationText(eq);
	}

	/* 
		AddTile: handle when a tile is added to the entry set. 
	*/
	addTile(tile: Tile): void {
		this.tileSet.add(tile);
		const eq = this.makeEquation();
		this.view.updateEquationText(eq);
	}

	private async saveProgressToBackend(towerCompleted: number): Promise<void> {
		try {
			const response = await fetch('http://localhost:3000/progress/update', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					username: GlobalPlayer.get_username(),
					towerCompleted: towerCompleted
				})
			})
			const data = await response.json();
			if (response.ok) {
				console.log('Progress saved to backend:', data)
			} else {
				console.error('Failed to save progress:', data.error)

			}
		}
		catch (error) {
			console.error('Network error saving progress', error)
		}
	}

	/*
	Start the timer
	*/
	private startTimer(): void {
		//console.log("timer started")
		this.gameTimer = setInterval(() => {
			const timeRemaining = this.model.tickTimer(); // decrement every tick
			this.view.updateTimer(timeRemaining);

			if (timeRemaining <= 0) {
				this.stopTimer();
				this.endPhase();
			}
		}, 1000);
	}

	private isPaused = false; // Tracks pause state 


	private togglePause(): void {
		if (this.isPaused) {
			// Resume the game
			this.resumeGame();
		} else {
			// Pause the game
			this.pauseGame();
		}
		this.isPaused = !this.isPaused;
	}

	private pauseGame(): void {
		this.stopTimer();
		this.view.showPauseOverlay();
		this.view.getTiles().forEach(tile => tile.getNode().listening(false));
		this.view.stopEquationPulsate();
		this.view.stopBossNumPulsate();
	}

	private resumeGame(): void {
		this.view.hidePauseOverlay(); // Add this line
		this.startTimer();
		this.view.getTiles().forEach(tile => tile.getNode().listening(true));
		this.view.startEquationPulsate();
		this.view.startBossNumPulsate();
	}

	public returnToTowerSelect(): void {
		this.stopTimer();
		this.view.hidePauseOverlay();
		this.view.hideGameOver();
		this.tileSet.clear();
		GlobalPlayer.reset_health();
		this.model.resetTimer();
		this.isPaused = false; // Reset pause state
		this.screenSwitcher.switchToScreen({ type: "tower_select" });
	}

	/**
 	* Stop the timer
 	*/
	private stopTimer(): void {
		if (this.gameTimer != null) {
			clearInterval(this.gameTimer);
			this.gameTimer = null;
		}
	}

	/* 
	* endPhase() - if the user fails to complete a phase on time, let them 
	retake the same question, for some consequence of score and health. We need 
	to clear the old equation, otherwise it persists, and reload the phase
	*/
	private endPhase(): void {
		// stop timer so it doesn't run 0 again
		this.stopTimer();
		this.view.updateTimer(0); //lock visual timer on 0

		//apply consequencyes
		this.model.subtractScore(5);
		this.view.updateScore(this.model.getScore());
		this.view.updateHealth(this.model.take_damage(1));
		this.resetEq();

		if (this.model.get_health() <= 0) {
			this.handleDeath();
			return;
		}

		//prepare next phse
		this.model.resetTimer();
		this.loadPhaseIntoView();
		this.startTimer(); //restart timer
	}

	private endGame(): void {
		this.stopTimer();
		//bring up pop up (to implement)

	}

	/* 
		makeEquation will convert the tiles in tileset into a string. It does 
		so by sorting the tiles in tileset by x position
	*/
	private makeEquation(): string {
		let toReturn: string = ""
		if (this.tileSet.size == 0) {
			return "";
		}

		const tileArray: Tile[] = Array.from(this.tileSet);

		tileArray.sort((a, b) => a.getPosition().x - b.getPosition().x)

		for (let i = 0; i < tileArray.length; i++) {
			toReturn += tileArray[i].getLabel();
		}

		return toReturn
	}

	private checkEQ(): boolean {
		// check if the equation made by makeEquation() equals the boss num
		// return true if it does equal boss num

		const val: number = evaluate(this.makeEquation());

		return val === this.boss.getCurrentPhase().targetNumber;
	}

	setTower(tower: number): void {
		this.tower = tower;
		this.equationMode = this.getEquationModeForTower(tower);

		this.boss = this.spawnBoss();
		this.model.resetTimer();
	}

	handleDeath(): void {
		this.stopTimer();
		this.view.showGameOver();
	}

	resetEq(): void {
		this.tileSet.clear();
		this.view.updateEquationText("");
	}
}
