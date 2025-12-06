import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import type { TowerType } from "../../types.ts";

/**
 * TowerSelectScreenView - displays the tower selection screen using Konva
 */
export class TowerSelectScreenView implements View {
	private group: Konva.Group;
	private onTowerSelect?: (towerType: TowerType) => void;
	private onSpeedGameClick?: () => void;
	private infoModalGroup: Konva.Group | null = null;
	private isModalOpen: boolean = false;

    constructor() {
		this.group = new Konva.Group({ visible: false });
		this.setupUI();
    }

	private setupUI(): void {
		// Sky Gradient (Dark Purple Sunset)
		const sky = new Konva.Rect({
			x: 0,
			y: 0,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
			fillLinearGradientStartPoint: { x: 0, y: 0 },
			fillLinearGradientEndPoint: { x: 0, y: STAGE_HEIGHT },
			fillLinearGradientColorStops: [0, "#2E1A47", 0.6, "#6A2C70", 1, "#F08A5D"], //purple --> pink --> orange sky color
		});
		this.group.add(sky);

		const moon = new Konva.Circle({
			x: STAGE_WIDTH - 100,
			y: 80,
			radius: 40,
			fill: "#F4F6F0", 
			shadowColor: "#FFFFFF",
			shadowBlur: 30,
			shadowOpacity: 0.6,
		});
		this.group.add(moon);

		//Background Mountains 
		this.createPixelTerrain(STAGE_HEIGHT / 2 + 50, "#372549", 0.9, 80);

		// Midground Hills 
		this.createPixelTerrain(STAGE_HEIGHT / 2 + 120, "#1A3C40", 1, 60);

		// Ground (Dark Dirt)
		const groundY = STAGE_HEIGHT - 100;
		const ground = new Konva.Rect({
			x: 0,
			y: groundY,
			width: STAGE_WIDTH,
			height: 100,
			fill: "#3E2723", // Dark brown
			stroke: "#1B5E20", // Dark grass top
			strokeWidth: 10,
		});
		this.group.add(ground);

		
		this.createWelcomeMessage();

		
		this.createInfoButton();

		// Add Speed Game button (top left)
		this.createSpeedGameButton();

		// Button dimensions and spacing for 5 towers
		const buttonWidth = 120;
		const buttonHeight = 50;
		const buttonSpacing = 20;
		const startY = STAGE_HEIGHT - 150;

		// Lay out 5 towers left→right
		const totalWidth = 5 * buttonWidth + 4 * buttonSpacing;
		const startX = STAGE_WIDTH / 2 - totalWidth / 2;

		//Addition
		const addTower = this.createTowerButton(
			"Addition",
			"+",
			startX,
			startY,
			buttonWidth,
			buttonHeight,
			"#C0392B" // Red
		);
		addTower.on("click", () => { if (this.onTowerSelect) this.onTowerSelect("addition"); });
		this.group.add(addTower);

		// Subtraction
		const subTower = this.createTowerButton(
			"Subtraction",
			"-",
			startX + (buttonWidth + buttonSpacing),
			startY,
			buttonWidth,
			buttonHeight,
			"#2980B9" // Blue
		);
		subTower.on("click", () => { if (this.onTowerSelect) this.onTowerSelect("subtraction"); });
		this.group.add(subTower);
		

		//Multiplication
		const multTower = this.createTowerButton(
			"Multiplication",
			"×",
			startX + 2 * (buttonWidth + buttonSpacing),
			startY,
			buttonWidth,
			buttonHeight,
			"#27AE60" // Green
		);
		multTower.on("click", () => { if (this.onTowerSelect) this.onTowerSelect("multiplication"); });
		this.group.add(multTower);

		// Division
		const divTower = this.createTowerButton(
			"Division",
			"÷",
			startX + 3 * (buttonWidth + buttonSpacing),
			startY,
			buttonWidth,
			buttonHeight,
			"#8E44AD" // Purple
		);
		divTower.on("click", () => { if (this.onTowerSelect) this.onTowerSelect("division"); });
		this.group.add(divTower);

		//Tower of All Operations
		const comboTower = this.createTowerButton(
			"All Operations",
			"★",
			startX + 4 * (buttonWidth + buttonSpacing),
			startY,
			buttonWidth,
			buttonHeight,
			"#F39C12" // Gold
		);
		comboTower.on("click", () => { if (this.onTowerSelect) this.onTowerSelect("combo"); });
		this.group.add(comboTower);

		// Create info modal (initially hidden)
		this.createInfoModal();
	}

	private createSpeedGameButton(): void {
		const buttonWidth = 150;
		const buttonHeight = 50;
		const padding = 20;

		const speedGameGroup = new Konva.Group({
			x: padding,
			y: padding,
		});

		// Button background
		const buttonBg = new Konva.Rect({
			width: buttonWidth,
			height: buttonHeight,
			fill: "#E67E22", // Orange color
			stroke: "#D35400",
			strokeWidth: 3,
			cornerRadius: 10,
			shadowColor: "black",
			shadowBlur: 5,
			shadowOffset: { x: 2, y: 2 },
			shadowOpacity: 0.3,
		});
		speedGameGroup.add(buttonBg);

		// Lightning bolt icon (⚡)
		const icon = new Konva.Text({
			x: 10,
			y: buttonHeight / 2,
			text: "⚡",
			fontSize: 28,
			fill: "white",
			align: "center",
		});
		icon.y(icon.y() - icon.height() / 2);
		speedGameGroup.add(icon);

		// Button text
		const buttonText = new Konva.Text({
			x: 35,
			y: buttonHeight / 2,
			text: "Speed Game",
			fontSize: 18,
			fontFamily: "Arial",
			fill: "white",
			align: "left",
			fontStyle: "bold",
		});
		buttonText.y(buttonText.y() - buttonText.height() / 2);
		speedGameGroup.add(buttonText);

		// Hover effects
		speedGameGroup.on("mouseenter", () => {
			document.body.style.cursor = "pointer";
			buttonBg.fill("#D35400");
			buttonBg.scale({ x: 1.05, y: 1.05 });
			this.group.getLayer()?.draw();
		});

		speedGameGroup.on("mouseleave", () => {
			document.body.style.cursor = "default";
			buttonBg.fill("#E67E22");
			buttonBg.scale({ x: 1, y: 1 });
			this.group.getLayer()?.draw();
		});

		// Click handler
		speedGameGroup.on("click", () => {
			if (this.onSpeedGameClick) {
				this.onSpeedGameClick();
			}
		});

		this.group.add(speedGameGroup);
	}

	private createPixelTerrain(baseY: number, color: string, opacity: number, variance: number): void {
		const segments = 20; // Number of "steps" across the screen
		const segmentWidth = STAGE_WIDTH / segments;
		const points: number[] = [];

		points.push(0, STAGE_HEIGHT); // Start bottom-left
		points.push(0, baseY);        // Start at base height

		let currentY = baseY;
		
		for (let i = 0; i <= segments; i++) {
			//goes up and down randomly to create a blocky effecet
			const step = (Math.random() - 0.5) * variance;
			currentY += step;
			
			
			if (currentY < baseY - variance) currentY = baseY - variance;
			if (currentY > baseY + variance) currentY = baseY + variance;

			const x = i * segmentWidth;
			points.push(x, currentY);
			
			
			if (i < segments) {
				points.push((i + 1) * segmentWidth, currentY);
			}
		}

		points.push(STAGE_WIDTH, STAGE_HEIGHT); // End bottom-right
		points.push(0, STAGE_HEIGHT);           // Close loop

		const terrain = new Konva.Line({
			points: points,
			fill: color,
			closed: true,
			opacity: opacity,
		});
		this.group.add(terrain);
	}

	private createWelcomeMessage(): void {
		// Welcome title with shadow
		const welcomeShadow = new Konva.Text({
			x: STAGE_WIDTH / 2 + 3,
			y: 53,
			text: "Welcome to Math Towers!",
			fontSize: 42,
			fontFamily: "Arial",
			fill: "black", 
			opacity: 0.5,
			align: "center",
			fontStyle: "bold",
		});
		welcomeShadow.x(welcomeShadow.x() - welcomeShadow.width() / 2);
		this.group.add(welcomeShadow);

		const welcomeText = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: 50,
			text: "Welcome to Math Towers!",
			fontSize: 42,
			fontFamily: "Arial",
			fill: "#FFFFFF", // White text 
			align: "center",
			fontStyle: "bold",
			shadowColor: "#F08A5D",
			shadowBlur: 10,
		});
		welcomeText.x(welcomeText.x() - welcomeText.width() / 2);
		this.group.add(welcomeText);

		// Subtitle
		const subtitle = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: 100,
			text: "Select a tower to begin your mathematical adventure",
			fontSize: 18,
			fontFamily: "Arial",
			fill: "#E0E0E0", // Light gray text
			align: "center",
		});
		subtitle.x(subtitle.x() - subtitle.width() / 2);
		this.group.add(subtitle);
	}

	private createInfoButton(): void {
		const buttonSize = 50;
		const radius = buttonSize / 2;
		// Position group so circle stays within bounds with padding
		const padding = 20;
		const buttonX = STAGE_WIDTH - radius - padding;
		const buttonY = STAGE_HEIGHT - radius - padding;

		const infoButtonGroup = new Konva.Group({
			x: buttonX,
			y: buttonY,
		});

		// Button background (circle)
		const buttonBg = new Konva.Circle({
			radius: buttonSize / 2,
			fill: "#3498db",
			stroke: "#2980b9",
			strokeWidth: 3,
			shadowColor: "black",
			shadowBlur: 5,
			shadowOffset: { x: 2, y: 2 },
			shadowOpacity: 0.3,
		});
		infoButtonGroup.add(buttonBg);

		//having trouble getting question mark into the center
		const questionMark = new Konva.Text({
			x: -buttonSize / 2,
			y: -buttonSize / 2 + 9, // +9 for vertical centering 
			width: buttonSize,
			text: "?",
			fontSize: 32,
			fontFamily: "Arial",
			fill: "white",
			align: "center",
			fontStyle: "bold",
		});
		
		infoButtonGroup.add(questionMark);

		// Hover effects
		infoButtonGroup.on("mouseenter", () => {
			document.body.style.cursor = "pointer";
			buttonBg.fill("#2980b9");
			buttonBg.scale({ x: 1.1, y: 1.1 });
			this.group.getLayer()?.draw();
		});

		infoButtonGroup.on("mouseleave", () => {
			document.body.style.cursor = "default";
			buttonBg.fill("#3498db");
			buttonBg.scale({ x: 1, y: 1 });
			this.group.getLayer()?.draw();
		});

		// Click handler
		infoButtonGroup.on("click", () => {
			this.toggleInfoModal();
		});

		this.group.add(infoButtonGroup);
	}

	private createInfoModal(): void {
		// background overlay
		const overlay = new Konva.Rect({
			x: 0,
			y: 0,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
			fill: "rgba(0, 0, 0, 0.6)",
			visible: false,
		});
		overlay.on("click", () => {
			this.toggleInfoModal();
		});

		//  box
		const modalWidth = 500;
		const modalHeight = 400;
		const modalX = STAGE_WIDTH / 2 - modalWidth / 2;
		const modalY = STAGE_HEIGHT / 2 - modalHeight / 2;

		const modalGroup = new Konva.Group({
			x: modalX,
			y: modalY,
			visible: false,
		});

		// modal background
		const modalBg = new Konva.Rect({
			width: modalWidth,
			height: modalHeight,
			fill: "white",
			stroke: "#3498db",
			strokeWidth: 4,
			cornerRadius: 15,
			shadowColor: "black",
			shadowBlur: 20,
			shadowOffset: { x: 0, y: 5 },
			shadowOpacity: 0.5,
		});
		modalGroup.add(modalBg);

		// Title
		const title = new Konva.Text({
			x: modalWidth / 2,
			y: 30,
			text: "How to Play",
			fontSize: 32,
			fontFamily: "Arial",
			fill: "#2C3E50",
			align: "center",
			fontStyle: "bold",
		});
		title.x(title.x() - title.width() / 2);
		modalGroup.add(title);

		// Instructions
		const instructions = [
			"(1) Each monster has a number appear near them",
			"(2) Select the answer with your mouse that has",
			"    the correct equation to match",
			"(3) Be Careful! If you select the wrong answer,",
			"    you'll lose a life. Three strikes and you're out...",
			"(4) Keep defeating monsters to climb the tower."
		];

		let yPos = 90;
		instructions.forEach((instruction) => {
			const instructionText = new Konva.Text({
				x: 30,
				y: yPos,
				text: instruction,
				fontSize: 16,
				fontFamily: "Arial",
				fill: "#34495e",
				align: "left",
				width: modalWidth - 60,
			});
			modalGroup.add(instructionText);
			yPos += 35;
		});

		// Close button
		const closeButtonSize = 40;
		const closeRadius = closeButtonSize / 2;
		const closePadding = 10; // Distance from edge
		
		const closeButton = new Konva.Group({
			// Position group so the circle (centered at 0,0) is inside the box
			x: modalWidth - closeRadius - closePadding, 
			y: closeRadius + closePadding,
		});

		const closeBg = new Konva.Circle({
			radius: closeButtonSize / 2,
			fill: "#e74c3c",
			stroke: "#c0392b",
			strokeWidth: 2,
		});
		closeButton.add(closeBg);

		const closeX = new Konva.Text({
			x: -closeButtonSize / 2,
			y: -closeButtonSize / 2 + 1, // Slight adjustment for centering
			width: closeButtonSize,
			height: closeButtonSize,
			text: "×",
			fontSize: 28,
			fontFamily: "Arial",
			fill: "white",
			align: "center",
			verticalAlign: "middle",
			fontStyle: "bold",
		});
		closeButton.add(closeX);

		closeButton.on("click", () => {
			this.toggleInfoModal();
		});

		closeButton.on("mouseenter", () => {
			document.body.style.cursor = "pointer";
			closeBg.fill("#c0392b");
			this.group.getLayer()?.draw();
		});

		closeButton.on("mouseleave", () => {
			document.body.style.cursor = "default";
			closeBg.fill("#e74c3c");
			this.group.getLayer()?.draw();
		});

		modalGroup.add(closeButton);

		// Prevent clicks on graphic from closing it
		modalGroup.on("click", (e) => {
			e.cancelBubble = true;
		});

		this.infoModalGroup = new Konva.Group();
		this.infoModalGroup.add(overlay);
		this.infoModalGroup.add(modalGroup);
		this.group.add(this.infoModalGroup);
	}

	private toggleInfoModal(): void {
		if (!this.infoModalGroup) return;

		this.isModalOpen = !this.isModalOpen;
		
		// Toggle visibility of overlay
		const overlay = this.infoModalGroup.children[0] as Konva.Rect;
		const modal = this.infoModalGroup.children[1] as Konva.Group;
		
		overlay.visible(this.isModalOpen);
		modal.visible(this.isModalOpen);
		
		this.group.getLayer()?.draw();
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

		// Draw tower structure (rectangle)
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

	public showLockedPopup(): void {
        //Create a dark overlay
        const overlay = new Konva.Rect({
            x: 0,
            y: 0,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            fill: "rgba(0,0,0,0.7)",
        });

        //Create the popup box
        const width = 400;
        const height = 200;
        const group = new Konva.Group({
            x: STAGE_WIDTH / 2 - width / 2,
            y: STAGE_HEIGHT / 2 - height / 2,
        });

        const rect = new Konva.Rect({
            width: width,
            height: height,
            fill: "#e74c3c", // Red color for "locked"
            stroke: "white",
            strokeWidth: 4,
            cornerRadius: 10,
            shadowColor: "black",
            shadowBlur: 10,
            shadowOpacity: 0.5,
        });

        // Add text
        const text = new Konva.Text({
            x: 20,
            y: 20,
            width: width - 40,
            text: "LOCKED!\n\nYou must complete the previous tower to unlock this one. \n\n(Press anywhere to close)",
            fontSize: 24,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
            fontStyle: "bold"
        });
        
        // Center the text vertically
        text.y((height - text.height()) / 2);

        //Close button logic (clear group and overlay)
        const closePopup = () => {
            group.destroy();
            overlay.destroy();
            this.group.getLayer()?.draw();
        };

        // Click anywhere to close
        overlay.on('click', closePopup);
        group.on('click', closePopup);

        group.add(rect);
        group.add(text);

        this.group.add(overlay);
        this.group.add(group);
        overlay.moveToTop();
        group.moveToTop();
        this.group.getLayer()?.draw();
    }

	setOnTowerSelect(callback: (towerType: TowerType) => void): void {
		this.onTowerSelect = callback;
	}

	setOnSpeedGameClick(callback: () => void): void {
		this.onSpeedGameClick = callback;
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