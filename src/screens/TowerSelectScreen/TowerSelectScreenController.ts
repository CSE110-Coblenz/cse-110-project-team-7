import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { TowerSelectScreenModel } from "./TowerSelectScreenModel.ts";
import { TowerSelectScreenView } from "./TowerSelectScreenView.ts";

/**
 * BaiscGameScreenController - Coordinates game logic between Model and View
 */
export class TowerSelectScreenController extends ScreenController {
	private model: TowerSelectScreenModel;
	private view: TowerSelectScreenView;
	private screenSwitcher: ScreenSwitcher;
	
    constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;

		this.model = new TowerSelectScreenModel();
		this.view = new TowerSelectScreenView();
    }
	/**
	 * Get the view group
	 */
	getView(): TowerSelectScreenView {
		return this.view;
	}
}
