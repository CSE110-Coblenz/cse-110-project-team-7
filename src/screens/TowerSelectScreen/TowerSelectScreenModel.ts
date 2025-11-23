import type { TowerType } from "../../types.ts";

/**
 * TowerSelectScreenModel - Manages tower selection state
 */
export class TowerSelectScreenModel {
	private selectedTower: TowerType | null = null;
	
	/**
	 * Set the selected tower type
	 */
	setSelectedTower(towerType: TowerType): void {
		this.selectedTower = towerType;
	}
	
	/**
	 * Get the selected tower type
	 */
	getSelectedTower(): TowerType | null {
		return this.selectedTower;
	}
}
