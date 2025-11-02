import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { BossGameScreenModel } from "./BossGameScreenModel.ts";
import { BossGameScreenView } from "./BossGameScreenView.ts";
import { GAME_DURATION } from "../../constants.ts";
import type { Tile } from "./Tile.ts";
import { evaluate } from "../../utils/equationSolver.ts";

/**
 * BaiscGameScreenController - Coordinates game logic between Model and View
 */
export class BossGameScreenController extends ScreenController {
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
		this.model.reset();

		// Update view
		this.view.updateScore(this.model.getScore());
		this.view.updateTimer(GAME_DURATION);
		this.view.show();

		this.startTimer();
	}

	addTile(tile: Tile): void {
		this.tileSet.add(tile)
		console.log(evaluate(this.makeEquation()))
	}
	removeTile(tile:Tile): void {
		this.tileSet.delete(tile)
		console.log(evaluate(this.makeEquation()))
	}

	/*
	Start the timer
	*/
	private startTimer(): void {
		// TODO: Task 3 - Implement countdown timer using setInterval

		let timeRemaining: number = GAME_DURATION;
		this.gameTimer = setInterval(() => {
			timeRemaining -= 1;
			this.view.updateTimer(timeRemaining);
			if (timeRemaining <= 0) {
				this.endGame();
			}
		}, 1000);
	}

	/**
	 * Stop the timer
	 */
	private stopTimer(): void {
		// TODO: Task 3 - Stop the timer using clearInterval

		if (this.gameTimer != null) {
			clearInterval(this.gameTimer);
			this.gameTimer = null;
		}
	}

	private endGame(): void {
		this.stopTimer();

		//bring up pop up

	}

	private makeEquation(): string {
		let toReturn: string = ""
		if (this.tileSet.size == 0){
			return "";
		}

		const tileArray: Tile[] = Array.from(this.tileSet);

		tileArray.sort((a,b) => a.getPosition().x - b.getPosition().x)

		for(let i = 0; i < tileArray.length; i++){
			toReturn += tileArray[i].getLabel(); 
		}

		return toReturn
	}
}
