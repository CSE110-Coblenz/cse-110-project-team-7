import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { BasicGameScreenModel } from "./BasicGameScreenModel";
import { BasicGameScreenView } from "./BasicGameScreenView.ts";

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
    }
	/**
	 * Get the view group
	 */
	getView(): BasicGameScreenView {
		return this.view;
	}
}
