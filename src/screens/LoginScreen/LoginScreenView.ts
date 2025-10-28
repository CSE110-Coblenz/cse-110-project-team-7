import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

/**
 * GameScreenView - Renders the game UI using Konva
 */
export class LoginScreenView implements View {
	private group: Konva.Group;
	private usernameInput: HTMLInputElement

    constructor(onUsernameEntered: (username: string) => void) {
		this.group = new Konva.Group({ visible: false });
		/*
	 	* Title text
		*/
		const title = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: STAGE_HEIGHT / 4,
			text: "Math Game Login Screen", // Temporary title
			fontSize: 36,
			fontFamily: "Arial",
			fill: "black",
			align: "center",
		});

		// HTML input element for username
		this.usernameInput = document.createElement("input");
		this.usernameInput.type = "text";
		this.usernameInput.placeholder = "Enter Username";
		this.usernameInput.style.position = "absolute";
		this.usernameInput.style.top = `${STAGE_HEIGHT / 2}px`;
		this.usernameInput.style.left = `${STAGE_WIDTH / 2 - 100}px`;
		this.usernameInput.style.width = "200px";
		this.usernameInput.style.fontSize = "16px";
		document.body.appendChild(this.usernameInput);

		// Handle Enter key to submit username
		this.usernameInput.addEventListener("keydown", (e: KeyboardEvent) => {
			if (e.key == "Enter") {
				const target = e.target as HTMLInputElement;
				onUsernameEntered(target.value);
				
			}
		});
		
		// Center the title
		title.offsetX(title.width() / 2);
		this.group.add(title);

    }

	
	/**
	 * Show the screen
	 */
	show(): void {
		this.group.visible(true);
		const layer = this.group.getLayer();
		if (layer) {
			layer.draw();
		}
	}

	/**
	 * Hide the screen
	 */
	hide(): void {
		this.group.visible(false);
		this.group.getLayer()?.draw();
	}

	getGroup(): Konva.Group {
		return this.group;
	}


}
