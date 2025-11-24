import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { BasicGameScreenModel } from "./BasicGameScreenModel.ts";
import { BasicGameScreenView } from "./BasicGameScreenView.ts";
import { Player } from '../../models/PlayerModel.ts'
import { BasicEnemy } from '../../models/BasicEnemyModel.ts'

/**
 * BaiscGameScreenController - Coordinates game logic between Model and View
 */
export class BasicGameScreenController extends ScreenController {
	private model: BasicGameScreenModel;
	private view: BasicGameScreenView;
	private screenSwitcher: ScreenSwitcher;
	
	
    constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;
		this.model = new BasicGameScreenModel();
		this.view = new BasicGameScreenView();
		this.view.setOnPause(() => this.togglePause());
    }
	/**
	 * Get the view group
	 */
	getView(): BasicGameScreenView {
		return this.view;
	}
	private isPaused = false;

	private togglePause() {
    	this.isPaused = !this.isPaused;
    	if (this.isPaused) {
    	    this.pauseGame();
    	} else {
    	    this.resumeGame();
    	}
	}

	private pauseGame() {
		console.log("Game Paused");//Testing
    	this.view.getGroup().listening(false);
	}

	private resumeGame() {
		//console.log("Game Resumed");//Testing
    	this.view.getGroup().listening(true);
	}

}

