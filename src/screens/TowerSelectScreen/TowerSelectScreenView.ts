import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import type { TowerType } from "../../types.ts";

/**
 * TowerSelectScreenView - Renders the tower selection UI using Konva
 */
export class TowerSelectScreenView implements View {
	private group: Konva.Group;
	private onTowerSelect?: (towerType: TowerType) => void;

    constructor() {
		this.group = new Konva.Group({ visible: false });
		this.setupUI();
    }

	private setupUI(): void {
		// Light background
		const bg = new Konva.Rect({
			x: 0,
			y: 0,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
			fill: "#e8e8e8", // Light gray background
		});
		this.group.add(bg);

		// Button dimensions and spacing
		const buttonWidth = 180;
		const buttonHeight = 60;
		const buttonSpacing = 40;
		const startY = STAGE_HEIGHT - 150; // Position near bottom

		// Lay out 3 towers left→right with equal spacing
		const totalWidth = 3 * buttonWidth + 2 * buttonSpacing;
		const startX = STAGE_WIDTH / 2 - totalWidth / 2;

		// Tower of Addition & Subtraction
		const addSubTower = this.createTowerButton(
			"Tower of Addition & Subtraction",
			"+",
			startX,
			startY,
			buttonWidth,
			buttonHeight,
			"#8B4513" // Brown/red for addition
		);
		addSubTower.on("click", () => { 
			if (this.onTowerSelect) { 
				this.onTowerSelect("add_sub"); 
			} 
		});
		this.group.add(addSubTower);

		// Tower of Multiplication & Division
		const multDivTower = this.createTowerButton(
			"Tower of Multiplication & Division",
			"×",
			startX + buttonWidth + buttonSpacing,
			startY,
			buttonWidth,
			buttonHeight,
			"#9ACD32" // Green for multiplication
		);
		multDivTower.on("click", () => { 
			if (this.onTowerSelect) { 
				this.onTowerSelect("mult_div"); 
			} 
		});
		this.group.add(multDivTower);

		// Tower of All Operations (Combo)
		const comboTower = this.createTowerButton(
			"Tower of All Operations",
			"÷",
			startX + 2 * (buttonWidth + buttonSpacing),
			startY,
			buttonWidth,
			buttonHeight,
			"#9370DB" // Purple for combo
		);
		comboTower.on("click", () => { 
			if (this.onTowerSelect) { 
				this.onTowerSelect("combo"); 
			} 
		});
		this.group.add(comboTower);

	}

	private createTowerButton(
		title: string,
		icon: string,
		x: number,
		y: number,
		width: number,
		height: number,
		symbolColor: string
	): Konva.Group {
		const group = new Konva.Group({
			x,
			y,
		});

		// Draw tower structure (simple rectangle)
		const towerBody = new Konva.Rect({
			x: width / 2 - 30,
			y: -200,
			width: 60,
			height: 200,
			fill: "#8B8680",  // Stone gray color
			stroke: "#5C5C5C",
			strokeWidth: 2,
			shadowColor: "black",
			shadowBlur: 10,
			shadowOffset: { x: 4, y: 4 },
			shadowOpacity: 0.5
		});

		group.add(towerBody);
		for (let i = 0; i < 7; i++){
			const brickLine = new Konva.Line({
				points: [
					width / 2 - 30, -200 + (i * 30),
					width / 2 + 30, -200 + (i * 30)
				],
				stroke: "#5C5C5C",
				strokeWidth: 4
			});
			group.add(brickLine);
		}
		

		// Draw large math symbol at top of tower
		const symbolCircle = new Konva.Circle({
			x: width / 2,
			y: -170,
			radius: 45,
			fill: symbolColor,
			stroke: "black",
			strokeWidth: 3,
			shadowColor: "black",
			shadowBlur: 10,
			shadowOffset: { x: 0, y: 3},
		});
		group.add(symbolCircle);

		const symbolText = new Konva.Text({
			x: width / 2,
			y: -170,
			text: icon,
			fontSize: 48,
			fontFamily: "Arial",
			fill: "white",
			align: "center",
			fontStyle: "bold",
		});
		symbolText.x(symbolText.x() - symbolText.width() / 2);
		symbolText.y(symbolText.y() - symbolText.height() / 2);
		group.add(symbolText);

		// Button background (tan/beige like the image)
		const button = new Konva.Rect({
			x: 0,
			y: 0,
			width,
			height,
			fill: "#d4af76", // Tan/beige color
			stroke: "black",
			strokeWidth: 2,
			cornerRadius: 10,
		});
		group.add(button);

		// Button text
		const buttonText = new Konva.Text({
			x: width / 2,
			y: height / 2,
			text: title,
			fontSize: 14,
			fontFamily: "Arial",
			fill: "black",
			align: "center",
			width: width - 10,
		});
		buttonText.x(buttonText.x() - buttonText.width() / 2);
		buttonText.y(buttonText.y() - buttonText.height() / 2);
		group.add(buttonText);

		// Hover effects
		group.on("mouseenter", () => {
			document.body.style.cursor = "pointer";
			button.fill("#c4a066"); // Slightly darker tan
			symbolCircle.strokeWidth(4);
			this.group.getLayer()?.draw();
		});

		group.on("mouseleave", () => {
			document.body.style.cursor = "default";
			button.fill("#d4af76");
			symbolCircle.strokeWidth(3);
			this.group.getLayer()?.draw();
		});

		return group;
	}

	setOnTowerSelect(callback: (towerType: TowerType) => void): void {
		this.onTowerSelect = callback;
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
