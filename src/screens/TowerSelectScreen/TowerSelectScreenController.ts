import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher, TowerType } from "../../types.ts";
import { TowerSelectScreenModel } from "./TowerSelectScreenModel.ts";
import { TowerSelectScreenView } from "./TowerSelectScreenView.ts";
import { GlobalPlayer } from "../../GlobalPlayer.ts";
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

	private tower_type_to_num(towerType: TowerType): number {
		switch(towerType) {
			case 'addition':
				return 1;
			case 'subtraction':
				return 2;
			case 'multiplication':
				return 3;
			case 'division':
				return 4;
			case 'combo':
				return 5
		}
	}
	private handleTowerSelection(towerType: TowerType): void {
		const towerNum = this.tower_type_to_num(towerType);
    
		if (!GlobalPlayer.is_tower_unlocked(towerNum)) {
			console.log(`Tower ${towerNum} is locked!`);
			this.view.showLockedPopup();
			return;
		}
		this.screenSwitcher.setCurrentTower(towerNum); 
		
		this.screenSwitcher.switchToScreen({ type: "basic_game" });
	}
	
	/**
	 * Get the view group
	 */
	getView(): TowerSelectScreenView {
		return this.view;
	}
}
