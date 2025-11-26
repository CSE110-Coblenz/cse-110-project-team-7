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
		this.view.getChoiceButtons().forEach(btn => btn.listening(false));
		const monster = this.view.getGroup().findOne(".monster");
		if (monster) monster.listening(false);

		const help = this.view.getGroup().findOne(".helpGroup");
		if (help) help.listening(false);

		const pauseButton = this.view.getGroup().findOne(".pauseButton");
		if (pauseButton) pauseButton.listening(false);
		if (pauseButton) pauseButton.visible(false);

		this.view.showPauseOverlay();
		console.log("Game Paused, pauseGame() called");//Testing
	}

	private resumeGame() {
		this.isPaused = false;
		this.view.getChoiceButtons().forEach(btn => btn.listening(true));
		const monster = this.view.getGroup().findOne(".monster");
		if (monster) monster.listening(true);

		const help = this.view.getGroup().findOne(".helpGroup");
		if (help) help.listening(true);

		const pauseButton = this.view.getGroup().findOne(".pauseButton");
		if (pauseButton) pauseButton.listening(true);
		if (pauseButton) pauseButton.visible(true);

		this.view.hidePauseOverlay();
		console.log("Pause button shown");//Testing

		// Need to fix overlay issue with the help button.
		
	}

}

