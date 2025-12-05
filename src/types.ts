import type { Group } from "konva/lib/Group";

export interface View {
	getGroup(): Group;
	show(): void;
	hide(): void;
}

/**
 * Tower types available in the game
 */
export type TowerType = "addition" | "subtraction" | "multiplication" | "division" | "combo";

/**
 * Screen types for navigation
 *
 * - "login": login screen
 * = "tower_select": tower selection screen
 *  - "basic_game": basic game (with optional tower type)
 * - "boss_game": boss game (with optional tower type)
 */
export type Screen =
	| { type: "login" }
    | { type: "tower_select"}
    | { type: "basic_game"; towerType?: TowerType }
	| { type: "boss_game"; towerType?: TowerType }
	| { type: "speed_game"; towerType?: TowerType}
	;

export abstract class ScreenController {
	abstract getView(): View;

	show(): void {
		this.getView().show();
	}

	hide(): void {
		this.getView().hide();
	}
}

export interface ScreenSwitcher {
	switchToScreen(screen: Screen): void;
	setCurrentTower(tower: number): void;
}
