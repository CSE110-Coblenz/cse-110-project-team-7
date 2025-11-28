import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { BossGameScreenModel } from "./BossGameScreenModel.ts";
import { BossGameScreenView } from "./BossGameScreenView.ts";
import { BossEnemyModel } from "../../models/BossEnemyModel.ts";
import type { Tile } from "./Tile.ts";
import type { EquationMode } from "../BasicGameScreen/BasicGameScreenModel.ts";
import { spawnEnemy } from "../../utils/enemyFactory.ts";
import { evaluate } from "../../utils/equationSolver.ts";
import { GlobalPlayer } from "../../GlobalPlayer.ts";
import Konva from "konva";

/**
 * BaiscGameScreenController - Coordinates game logic between Model and View
 */
export class BossGameScreenController extends ScreenController {
	private boss: BossEnemyModel;
	private model: BossGameScreenModel;
	private view: BossGameScreenView;
	private screenSwitcher: ScreenSwitcher;
	private gameTimer: number | null = null;
	private equationMode: EquationMode;
	private tileSet = new Set<Tile>();

	tower: number = 1;
	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;
		this.model = new BossGameScreenModel();
		this.view = new BossGameScreenView();
		this.equationMode = this.getEquationModeForTower(this.tower);

		this.view.setOnTileEntry((tile: Tile) => {
			this.addTile(tile);
		});

		this.view.setOnTileRemoval((tile: Tile) => {
			this.removeTile(tile)
		});

		this.view.setOnSubmitPress((_: Konva.Rect) => {
			this.checkSubmit();
		});
		
		this.boss = this.spawnBoss();


		// Pause functionality
		this.view.setOnPauseClick(() => {
			this.togglePause();
		});
	}

	private spawnBoss(): BossEnemyModel {
		return spawnEnemy('boss', 1, this.equationMode) as BossEnemyModel;
	}
	private getEquationModeForTower(tower: number): EquationMode {
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
		this.view.show();
		this.view.updateHealth(GlobalPlayer.get_health());
		this.view.updateScore(GlobalPlayer.get_score());
		this.startTimer();
	}

	private loadPhaseIntoView() {
		const phase = this.boss.getCurrentPhase();

		this.view.updateBossNum(phase.targetNumber.toString());
		this.view.updateBossImage(phase.imagePath);
		this.view.updatePhaseTiles(phase.tiles);
		this.view.updateEquationText("");
	}

	addTile(tile: Tile): void {
		this.tileSet.add(tile);
		const eq = this.makeEquation();
		this.view.updateEquationText(eq);
	}

	checkSubmit(): void {
		if (this.checkEQ()) {
			console.log("EQUATION COMPLETE");
			this.view.flashEquationGreen();
			this.model.addScore(10);
			this.view.updateScore(this.model.getScore());
			// Advance to next phase
			if (!this.boss.isFinalPhase()) {
				this.boss.nextPhase();
				this.tileSet.clear(); // Clear current tile selections
				this.loadPhaseIntoView();
				this.model.resetTimer();
			} else {
				// End game if final phase completed
				if (this.tower === GlobalPlayer.get_highest_tower()) {
                    GlobalPlayer.unlock_next_tower();
                }
				this.screenSwitcher.switchToScreen({ type: 'tower_select' })
				this.endGame();
			}
		} else {
			console.log("equation failed");
			this.view.flashEquationRed();
			this.model.subtractScore(7);
			GlobalPlayer.take_damage(1);
			this.view.updateScore(this.model.getScore());
			this.view.updateHealth(GlobalPlayer.get_health());
			if(GlobalPlayer.get_health() <= 0){
				this.handleDeath();
			}
		}
	}

	removeTile(tile: Tile): void {
		this.tileSet.delete(tile);
		const eq = this.makeEquation();
		this.view.updateEquationText(eq);
	}


	/*
	Start the timer
	*/
	private startTimer(): void {
		this.gameTimer = setInterval(() => {
			const timeRemaining = this.model.tickTimer(); // decrement every tick
			this.view.updateTimer(timeRemaining);

			if (timeRemaining <= 0) {
				this.endPhase();
			}
		}, 1000);
	}

	/**
	 * Stop the timer
	 */

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
		this.view.getGroup().listening(false); // Disable interactions
		this.view.stopEquationPulsate();
		this.view.stopBossNumPulsate();
	}

	private resumeGame(): void {
		this.startTimer();
		this.view.getGroup().listening(true); // Enable interactions
		this.view.startEquationPulsate();
		this.view.startBossNumPulsate();
	}
	
	private stopTimer(): void {
		if (this.gameTimer != null) {
			clearInterval(this.gameTimer);
			this.gameTimer = null;
		}

	}

	private endPhase(): void {
		//The user failed to complete the phase, just keep it as is
		this.loadPhaseIntoView();
		this.model.subtractScore(5)
		GlobalPlayer.take_damage(1);
		this.view.updateScore(this.model.getScore());
		this.view.updateHealth(GlobalPlayer.get_health());

		// Clear any tiles user placed (otherwise old equation persists)
		this.tileSet.clear();
		this.view.updateEquationText("");

		// Load the **same boss phase**, but reset timer first
		this.model.resetTimer(); // you MUST implement this if not already
		this.loadPhaseIntoView();

	}

	private endGame(): void {
		this.stopTimer();

		//bring up pop up

	}


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
		//return true if it does equal boss num

		const val: number = evaluate(this.makeEquation());

		return val === this.boss.getCurrentPhase().targetNumber;
	}

	setTower(tower: number): void {
        this.tower = tower;
        const equationMode = this.getEquationModeForTower(tower);
        
        this.boss = this.spawnBoss();
    }

	handleDeath(): void {
		this.view.showGameOver();
	}
}
