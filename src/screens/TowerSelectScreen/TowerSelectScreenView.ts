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
	private infoModalGroup: Konva.Group | null = null;
	private isModalOpen: boolean = false;

    constructor() {
		this.group = new Konva.Group({ visible: false });
		this.setupUI();
    }

	private setupUI(): void {
		// SAFEGUARD: If constants are 0/undefined, fallback to window or default
		const width = STAGE_WIDTH || window.innerWidth || 800;
		const height = STAGE_HEIGHT || window.innerHeight || 600;

		// 1. Sky Gradient (Dark Purple Sunset/Dusk)
		const sky = new Konva.Rect({
			x: 0,
			y: 0,
			width: width,
			height: height,
			fillLinearGradientStartPoint: { x: 0, y: 0 },
			fillLinearGradientEndPoint: { x: 0, y: height },
			fillLinearGradientColorStops: [0, "#2E1A47", 0.6, "#6A2C70", 1, "#F08A5D"], 
		});
		this.group.add(sky);

		// 2. Moon (Pale glow)
		const moon = new Konva.Circle({
			x: width - 100,
			y: 80,
			radius: 40,
			fill: "#F4F6F0", 
			shadowColor: "#FFFFFF",
			shadowBlur: 30,
			shadowOpacity: 0.6,
		});
		this.group.add(moon);

		// 3. Background Mountains
		this.createPixelTerrain(height / 2 + 50, "#372549", 0.9, 80);

		// 4. Midground Hills
		this.createPixelTerrain(height / 2 + 120, "#1A3C40", 1, 60);

		// 5. Foreground Ground
		const groundY = height - 100;
		const ground = new Konva.Rect({
			x: 0,
			y: groundY,
			width: width,
			height: 100,
			fill: "#3E2723",
			stroke: "#1B5E20",
			strokeWidth: 10,
		});
		this.group.add(ground);

		// UI Elements
		this.createWelcomeMessage();
		this.createInfoButton();

		// Towers
		const buttonWidth = 120;
		const buttonHeight = 50;
		const buttonSpacing = 20;
		const startY = height - 150;
		const totalWidth = 5 * buttonWidth + 4 * buttonSpacing;
		const startX = width / 2 - totalWidth / 2;

		// 1. Tower of Addition
		const addTower = this.createTowerButton("Addition", "+", startX, startY, buttonWidth, buttonHeight, "#C0392B");
		addTower.on("click", () => { if (this.onTowerSelect) this.onTowerSelect("addition"); });
		this.group.add(addTower);

		// 2. Tower of Subtraction
		const subTower = this.createTowerButton("Subtraction", "-", startX + (buttonWidth + buttonSpacing), startY, buttonWidth, buttonHeight, "#2980B9");
		subTower.on("click", () => { if (this.onTowerSelect) this.onTowerSelect("subtraction"); });
		this.group.add(subTower);

		// 3. Tower of Multiplication
		const multTower = this.createTowerButton("Multiplication", "×", startX + 2 * (buttonWidth + buttonSpacing), startY, buttonWidth, buttonHeight, "#27AE60");
		multTower.on("click", () => { if (this.onTowerSelect) this.onTowerSelect("multiplication"); });
		this.group.add(multTower);

		// 4. Tower of Division
		const divTower = this.createTowerButton("Division", "÷", startX + 3 * (buttonWidth + buttonSpacing), startY, buttonWidth, buttonHeight, "#8E44AD");
		divTower.on("click", () => { if (this.onTowerSelect) this.onTowerSelect("division"); });
		this.group.add(divTower);

		// 5. Tower of All Operations (Combo)
		const comboTower = this.createTowerButton("All Operations", "★", startX + 4 * (buttonWidth + buttonSpacing), startY, buttonWidth, buttonHeight, "#F39C12");
		comboTower.on("click", () => { if (this.onTowerSelect) this.onTowerSelect("combo"); });
		this.group.add(comboTower);

		// Create info modal
		this.createInfoModal();
	}

	private createPixelTerrain(baseY: number, color: string, opacity: number, variance: number): void {
		const width = STAGE_WIDTH || window.innerWidth || 800;
		const height = STAGE_HEIGHT || window.innerHeight || 600;
		
		const segments = 20;
		const segmentWidth = width / segments;
		const points: number[] = [];

		points.push(0, height); 
		points.push(0, baseY);

		let currentY = baseY;
		for (let i = 0; i <= segments; i++) {
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

		points.push(width, height); 
		points.push(0, height);

		const terrain = new Konva.Line({
			points: points,
			fill: color,
			closed: true,
			opacity: opacity,
		});
		this.group.add(terrain);
	}

	private createWelcomeMessage(): void {
		const width = STAGE_WIDTH || window.innerWidth || 800;
		
		const welcomeShadow = new Konva.Text({
			x: width / 2 + 3,
			y: 53,
			text: "Welcome to Math Towers!",
			fontSize: 42,
			fontFamily: "Arial",
			fill: "black", opacity: 0.5, align: "center", fontStyle: "bold",
		});
		welcomeShadow.x(welcomeShadow.x() - welcomeShadow.width() / 2);
		this.group.add(welcomeShadow);

		const welcomeText = new Konva.Text({
			x: width / 2,
			y: 50,
			text: "Welcome to Math Towers!",
			fontSize: 42,
			fontFamily: "Arial",
			fill: "#FFFFFF", align: "center", fontStyle: "bold",
			shadowColor: "#F08A5D", shadowBlur: 10,
		});
		welcomeText.x(welcomeText.x() - welcomeText.width() / 2);
		this.group.add(welcomeText);

		const subtitle = new Konva.Text({
			x: width / 2,
			y: 100,
			text: "Select a tower to begin your mathematical adventure",
			fontSize: 18,
			fontFamily: "Arial",
			fill: "#E0E0E0", align: "center",
		});
		subtitle.x(subtitle.x() - subtitle.width() / 2);
		this.group.add(subtitle);
	}

	private createInfoButton(): void {
		const width = STAGE_WIDTH || window.innerWidth || 800;
		const height = STAGE_HEIGHT || window.innerHeight || 600;
		
		const buttonSize = 50;
		const radius = buttonSize / 2;
		const padding = 20;
		const buttonX = width - radius - padding;
		const buttonY = height - radius - padding;

		const infoButtonGroup = new Konva.Group({
			x: buttonX,
			y: buttonY,
		});

		const buttonBg = new Konva.Circle({
			radius: buttonSize / 2,
			fill: "#3498db", stroke: "#2980b9", strokeWidth: 3,
			shadowColor: "black", shadowBlur: 5, shadowOffset: { x: 2, y: 2 }, shadowOpacity: 0.3,
		});
		infoButtonGroup.add(buttonBg);

		const questionMark = new Konva.Text({
			x: -buttonSize / 2,
			y: -buttonSize / 2 + 9,
			width: buttonSize,
			text: "?", fontSize: 32, fontFamily: "Arial", fill: "white",
			align: "center", fontStyle: "bold",
		});
		infoButtonGroup.add(questionMark);

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

		infoButtonGroup.on("click", () => {
			this.toggleInfoModal();
		});

		this.group.add(infoButtonGroup);
	}

	private createInfoModal(): void {
		const width = STAGE_WIDTH || window.innerWidth || 800;
		const height = STAGE_HEIGHT || window.innerHeight || 600;

		const overlay = new Konva.Rect({
			x: 0, y: 0, width: width, height: height, fill: "rgba(0, 0, 0, 0.6)", visible: false,
		});
		overlay.on("click", () => { this.toggleInfoModal(); });

		const modalWidth = 500;
		const modalHeight = 400;
		const modalX = width / 2 - modalWidth / 2;
		const modalY = height / 2 - modalHeight / 2;

		const modalGroup = new Konva.Group({
			x: modalX, y: modalY, visible: false,
		});

		const modalBg = new Konva.Rect({
			width: modalWidth, height: modalHeight, fill: "white", stroke: "#3498db", strokeWidth: 4, cornerRadius: 15,
			shadowColor: "black", shadowBlur: 20, shadowOffset: { x: 0, y: 5 }, shadowOpacity: 0.5,
		});
		modalGroup.add(modalBg);

		const title = new Konva.Text({
			x: modalWidth / 2, y: 30, text: "How to Play", fontSize: 32, fontFamily: "Arial", fill: "#2C3E50",
			align: "center", fontStyle: "bold",
		});
		title.x(title.x() - title.width() / 2);
		modalGroup.add(title);

		const instructions = [
			"(1) Each monster has a number appear near them",
			"(2) Select the answer with your mouse that has",
			"    the correct equation to match",
			"(3) Be Careful! If you select the wrong answer,",
			"    you'll lose a life. Three strikes and you're out...",
			"(4) Keep defeating monsters to climb the tower."
		];

		let yPos = 90;
		instructions.forEach((instruction, index) => {
			const instructionText = new Konva.Text({
				x: 30, y: yPos, text: instruction, fontSize: 16, fontFamily: "Arial", fill: "#34495e",
				align: "left", width: modalWidth - 60,
			});
			modalGroup.add(instructionText);
			yPos += 35;
		});

		const closeButtonSize = 40;
		const closeRadius = closeButtonSize / 2;
		const closePadding = 10;
		
		const closeButton = new Konva.Group({
			x: modalWidth - closeRadius - closePadding, 
			y: closeRadius + closePadding,
		});

		const closeBg = new Konva.Circle({
			radius: closeButtonSize / 2, fill: "#e74c3c", stroke: "#c0392b", strokeWidth: 2,
		});
		closeButton.add(closeBg);

		const closeX = new Konva.Text({
			x: -closeButtonSize / 2, y: -closeButtonSize / 2 + 1,
			width: closeButtonSize, height: closeButtonSize,
			text: "×", fontSize: 28, fontFamily: "Arial", fill: "white",
			align: "center", verticalAlign: "middle", fontStyle: "bold",
		});
		closeButton.add(closeX);

		closeButton.on("click", () => { this.toggleInfoModal(); });
		closeButton.on("mouseenter", () => { document.body.style.cursor = "pointer"; closeBg.fill("#c0392b"); this.group.getLayer()?.draw(); });
		closeButton.on("mouseleave", () => { document.body.style.cursor = "default"; closeBg.fill("#e74c3c"); this.group.getLayer()?.draw(); });

		modalGroup.add(closeButton);
		modalGroup.on("click", (e) => { e.cancelBubble = true; });

		this.infoModalGroup = new Konva.Group();
		this.infoModalGroup.add(overlay);
		this.infoModalGroup.add(modalGroup);
		this.group.add(this.infoModalGroup);
	}

	private toggleInfoModal(): void {
		if (!this.infoModalGroup) return;
		this.isModalOpen = !this.isModalOpen;
		const overlay = this.infoModalGroup.children[0] as Konva.Rect;
		const modal = this.infoModalGroup.children[1] as Konva.Group;
		overlay.visible(this.isModalOpen);
		modal.visible(this.isModalOpen);
		this.group.getLayer()?.draw();
	}

	private createTowerButton(title: string, icon: string, x: number, y: number, width: number, height: number, symbolColor: string): Konva.Group {
		const group = new Konva.Group({ x, y });

		const towerBody = new Konva.Rect({
			x: width / 2 - 30, y: -200, width: 60, height: 200,
			fill: "#8B8680", stroke: "#5C5C5C", strokeWidth: 2,
			shadowColor: "black", shadowBlur: 10, shadowOffset: { x: 4, y: 4 }, shadowOpacity: 0.5
		});
		group.add(towerBody);

		for (let i = 0; i < 7; i++){
			const brickLine = new Konva.Line({
				points: [width / 2 - 30, -200 + (i * 30), width / 2 + 30, -200 + (i * 30)],
				stroke: "#5C5C5C", strokeWidth: 4
			});
			group.add(brickLine);
		}
		
		const symbolCircle = new Konva.Circle({
			x: width / 2, y: -170, radius: 45,
			fill: symbolColor, stroke: "black", strokeWidth: 3,
			shadowColor: "black", shadowBlur: 10, shadowOffset: { x: 0, y: 3},
		});
		group.add(symbolCircle);

		const symbolText = new Konva.Text({
			x: width / 2, y: -170, text: icon, fontSize: 48, fontFamily: "Arial", fill: "white", align: "center", fontStyle: "bold",
		});
		symbolText.x(symbolText.x() - symbolText.width() / 2);
		symbolText.y(symbolText.y() - symbolText.height() / 2);
		group.add(symbolText);

		const button = new Konva.Rect({
			x: 0, y: 0, width, height,
			fill: "#d4af76", stroke: "black", strokeWidth: 2, cornerRadius: 10,
		});
		group.add(button);

		const buttonText = new Konva.Text({
			x: width / 2, y: height / 2, text: title, fontSize: 14, fontFamily: "Arial", fill: "black", align: "center", width: width - 10,
		});
		buttonText.x(buttonText.x() - buttonText.width() / 2);
		buttonText.y(buttonText.y() - buttonText.height() / 2);
		group.add(buttonText);

		group.on("mouseenter", () => {
			document.body.style.cursor = "pointer";
			button.fill("#c4a066");
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

	show(): void {
		this.group.visible(true);
		this.group.getLayer()?.draw();
	}

	hide(): void {
		this.group.visible(false);
		this.group.getLayer()?.draw();
	}

	getGroup(): Konva.Group {
		return this.group;
	}
}