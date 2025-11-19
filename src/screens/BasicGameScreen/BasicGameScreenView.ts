import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

/**
 * GameScreenView - Renders the game UI using Konva
 */
export class BasicGameScreenView implements View {
	private group: Konva.Group;

    constructor() {
		this.group = new Konva.Group({ visible: false });
		this.setupUI();
    }

	private setupUI(): void {
		// White background
		const bg = new Konva.Rect({
			x: 0,
			y: 0,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
			fill: "white",
		});
		this.group.add(bg);

		// Placeholder text
		const placeholder = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: STAGE_HEIGHT / 2,
			text: "Game Screen (Placeholder)",
			fontSize: 32,
			fontFamily: "Arial",
			fill: "black",
			align: "center",
		});
		placeholder.x(placeholder.x() - placeholder.width() / 2);
		placeholder.y(placeholder.y() - placeholder.height() / 2);
		this.group.add(placeholder);
	}

	/**
	 * Show the screen
	 */
	show(): void {
		this.group.visible(true);
		this.group.getLayer()?.draw();
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
