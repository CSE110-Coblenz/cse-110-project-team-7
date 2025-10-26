import type { Group } from "konva/lib/Group";

export interface View {
	getGroup(): Group;
	show(): void;
	hide(): void;
}

/**
 * Screen types for navigation
 *
 * - "login": login screen
 * = "tower_select": tower selection screen
 *  - "basic_game": basic game
 * - "boss_game": boss game
 */
export type Screen =
	| { type: "login" }
    | { type: "tower_select"}
    | { type: "basic_game"}
	| { type: "boss_game" }
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
}
