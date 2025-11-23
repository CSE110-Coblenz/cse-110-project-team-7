import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher, TowerType } from "../../types.ts";
import { TowerSelectScreenModel } from "./TowerSelectScreenModel.ts";
import { TowerSelectScreenView } from "./TowerSelectScreenView.ts";

/**
 * TowerSelectScreenController - Coordinates tower selection logic between Model and View
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
		
		// Set up the callback for when a tower is selected
		this.view.setOnTowerSelect((towerType: TowerType) => {
			this.handleTowerSelection(towerType);
		});
    }
	
	/**
	 * Handle tower selection and navigate to the appropriate game screen
	 */
	private handleTowerSelection(towerType: TowerType): void {
		this.model.setSelectedTower(towerType);
		
		this.screenSwitcher.switchToScreen({
			type: "basic_game",
			towerType: towerType
		});
	}
	
	/**
	 * Get the view group
	 */
	getView(): TowerSelectScreenView {
		return this.view;
	}
}
