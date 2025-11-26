import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { BossGameScreenModel } from "./BossGameScreenModel.ts";
import { BossGameScreenView } from "./BossGameScreenView.ts";
import { BossEnemyModel } from "../../models/BossEnemyModel.ts";
import type { Tile } from "./Tile.ts";
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

	private tileSet = new Set<Tile>();

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;

		this.model = new BossGameScreenModel();
		this.view = new BossGameScreenView();

		this.view.setOnTileEntry((tile: Tile) => {
			this.addTile(tile);
		});

		this.view.setOnTileRemoval((tile: Tile) => {
			this.removeTile(tile)
		});

		this.view.setOnSubmitPress((_: Konva.Rect) => {
			this.checkSubmit();
		});

		this.boss = new BossEnemyModel([
			{ targetNumber: 12, tiles: ["30", "+", "9", "-", "9", '-'], imagePath: "https://p7.hiclipart.com/preview/79/102/357/pac-man-world-3-ghosts-clip-art-pac-man-ghost-png-transparent-image-thumbnail.jpg" },
			{ targetNumber: 8, tiles: ["4", "x", "2"], imagePath: "https://p7.hiclipart.com/preview/79/102/357/pac-man-world-3-ghosts-clip-art-pac-man-ghost-png-transparent-image-thumbnail.jpg" },
			{ targetNumber: 5, tiles: ["7", "-", "2"], imagePath: "https://p7.hiclipart.com/preview/79/102/357/pac-man-world-3-ghosts-clip-art-pac-man-ghost-png-transparent-image-thumbnail.jpg" },
			{ targetNumber: 20, tiles: ["4", "x", "5"], imagePath: "https://p7.hiclipart.com/preview/79/102/357/pac-man-world-3-ghosts-clip-art-pac-man-ghost-png-transparent-image-thumbnail.jpg" }
		]);

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

	
}
