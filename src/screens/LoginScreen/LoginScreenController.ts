import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { LoginScreenModel } from "./LoginScreenModel.ts";
import { LoginScreenView } from "./LoginScreenView.ts";

/**
 * BaiscGameScreenController - Coordinates game logic between Model and View
 */
export class LoginScreenController extends ScreenController {
	private model: LoginScreenModel;
	private view: LoginScreenView;
	private screenSwitcher: ScreenSwitcher;
	
    constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;

	// Initialize Model and View
		this.model = new LoginScreenModel();
		this.view = new LoginScreenView((username: string) => {
			this.model.username = username;
			console.log("Username entered:", this.model.username); // For testing purposes
		});
    }
	/**
	 * Get the view group
	 */
	getView(): LoginScreenView {
		return this.view;
	}
}
