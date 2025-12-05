import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import { Tile } from "./Tile.ts"

/**
 * BossGameScreenView - Renders the game UI using Konva
 */
export class BossGameScreenView implements View {
	//private parts: string[] = ["0", "x", "0"]
	private group: Konva.Group;
	private scoreText: Konva.Text;
	private timerText: Konva.Text;
	private tiles: Tile[] = [];

	private entryBox: Konva.Rect;
	private inventory: Konva.Rect;

	private entryEquationText: Konva.Text;

	//entry submission box
	private submitText: Konva.Text;
	private submitRect: Konva.Rect;

	//health pngs
	private hearts?: Konva.Image[] = [];

	//boss png
	private bossImageNode?: Konva.Image;

	//boss number
	private bossNumber: Konva.Text;

	//game over text (to be hidden)
	private gameOverGroup?: Konva.Group;

	//tile callbacks
	private onTileEntry?: (tile: Tile) => void;
	private onTileRemoval?: (tile: Tile) => void;

	//submit press callbacks
	private onSubmitPress?: (rect: Konva.Rect) => void;

	private equationPulseAnim?: Konva.Animation;
	private bossNumPulseAnim?: Konva.Animation;

	//Pause functionality
	private onPauseClick?: () => void;
	setOnPauseClick(callback: () => void): void {
		this.onPauseClick = callback;
	}
	private pauseOverlay?: Konva.Rect;
	private pauseCloseBtn?: Konva.Text;
	private quitBtn?: Konva.Group;
	private pauseButton!: Konva.Text;
	private onQuitClick?: () => void;
	setOnQuitClick(callback: () => void): void {
		this.onQuitClick = callback;
	}
	getTiles(): Tile[] {
		return this.tiles;
	}


	constructor() {
		this.group = new Konva.Group({ visible: false });

		//static background
		const bg = new Konva.Rect({
			x: 0,
			y: 0,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
			fill: "#ffffffff", // Sky blue
		});
		this.group.add(bg);

		//boss number (targe number) that appears over the boss image
		this.bossNumber = new Konva.Text({
			x: STAGE_WIDTH / 2 - 25,
			y: 10,
			text: "place",
			fontSize: 50,
			fontFamily: "Arial",
			fontStyle: "italic bold",
			fill: "black",
		});
		this.group.add(this.bossNumber);

		//the current score (to be rendered later from controller)
		this.scoreText = new Konva.Text({
			x: 20,
			y: 20,
			text: "Score: 0",
			fontSize: 32,
			fontFamily: "Arial",
			fill: "black",
		});
		this.group.add(this.scoreText);

		//timer text (initalizes to 0)
		this.timerText = new Konva.Text({
			x: STAGE_WIDTH - 150,
			y: 20,
			text: "Time: 30",
			fontSize: 32,
			fontFamily: "Arial",
			fill: "red",
			fontStyle: 'bold'
		});
		this.group.add(this.timerText);

		//Pause Button (top-right corner)
		this.pauseButton = new Konva.Text({
			x: STAGE_WIDTH - 70,
			y: 100,
			text: "II",
			fontSize: 40,
			fontFamily: "Arial",
			fill: "#F7C500",
			stroke: "black",
			strokeWidth: 2,
			cursor: "pointer",
			fontStyle: "bold"
		});
		this.group.add(this.pauseButton);


		this.pauseButton.on("mouseover", () => {
			document.body.style.cursor = "pointer";
			this.pauseButton.fill("#D1A700");
			this.group.getLayer()?.draw();
		});

		this.pauseButton.on("mouseout", () => {
			document.body.style.cursor = "default";
			this.pauseButton.fill("#F7C500");
			this.group.getLayer()?.draw();
		});

		this.pauseButton.on("click", () => {
			// Implement pause functionality here
			if (this.onPauseClick) this.onPauseClick();
		});


		// Entry Box (bottom-left quadrant)
		this.entryBox = new Konva.Rect({
			x: 0, // left edge
			y: STAGE_HEIGHT / 2 + 50, // start halfway down
			width: STAGE_WIDTH / 2,
			height: STAGE_HEIGHT / 2 - 50,
			fill: "#555",
			stroke: "black",
			strokeWidth: 3,
			cornerRadius: 10,
		});
		this.group.add(this.entryBox);

		// Label for Entry Box
		const entryLabel = new Konva.Text({
			x: this.entryBox.x(),
			y: this.entryBox.y() - 30,
			width: this.entryBox.width(),
			align: "center",
			text: "Entry Box",
			fontSize: 20,
			fontFamily: "Arial",
			fill: "black",
		});
		this.group.add(entryLabel);

		// small text box that shows the inputted equation
		this.entryEquationText = new Konva.Text({
			x: STAGE_WIDTH / 2 - 200,
			y: this.entryBox.y() - 60, // just above the "Entry Box" label
			width: 700,
			align: "left",
			text: "Current: ",
			fontSize: 50,
			fontFamily: "Impact",
			fill: "black",
		});
		this.group.add(this.entryEquationText);

		// submission (needs to be interactable)
		this.submitRect = new Konva.Rect({
			x: STAGE_WIDTH / 4 - 100,
			y: STAGE_HEIGHT - 100,
			width: 200,
			height: 50,
			fill: "#f0f0f0",
			stroke: "black",
			strokeWidth: 3,
			cornerRadius: 1
		})
		this.group.add(this.submitRect);

		this.submitText = new Konva.Text({
			text: "Submit",
			x: this.submitRect.x(),
			y: this.submitRect.y(),
			width: this.submitRect.width(),
			height: this.submitRect.height(),
			align: "center",
			verticalAlign: "middle",
			fontSize: 45,
			listening: false
		});
		this.group.add(this.submitText);

		this.submitRect.on('click', () => {
			console.log("submission presssed");
			if (this.onSubmitPress) this.onSubmitPress(this.submitRect);
		});

		this.submitRect.on("mouseover", () => {
			document.body.style.cursor = "pointer";
		});
		this.submitRect.on("mouseout", () => {
			document.body.style.cursor = "default";
		});

		// Inventory (bottom-right quadrant)
		this.inventory = new Konva.Rect({
			x: STAGE_WIDTH / 2, // right half
			y: STAGE_HEIGHT / 2 + 50, // bottom half
			width: STAGE_WIDTH / 2,
			height: STAGE_HEIGHT / 2 - 50,
			fill: "#d2b48c",
			stroke: "black",
			strokeWidth: 3,
			cornerRadius: 10,
		});
		this.group.add(this.inventory);

		// Label for Inventory
		const inventoryLabel = new Konva.Text({
			x: this.inventory.x(),
			y: this.inventory.y() - 30,
			width: this.inventory.width(),
			align: "center",
			text: "Inventory",
			fontSize: 20,
			fontFamily: "Arial",
			fill: "black",
		});
		this.group.add(inventoryLabel);


	}

	private isInsideEntryBox(node: Konva.Group): boolean {
		const box = this.entryBox.getClientRect();
		const tile = node.getClientRect();

		const overlap =
			tile.x < box.x + box.width &&
			tile.x + tile.width > box.x &&
			tile.y < box.y + box.height &&
			tile.y + tile.height > box.y;

		return overlap;
	}

	updateEquationText(equation: string): void {
		this.entryEquationText.text(`Current: ${equation}`);
		this.group.getLayer()?.draw();
	}

	setOnTileEntry(callback: (tile: Tile) => void): void {
		this.onTileEntry = callback;
	}

	setOnTileRemoval(callback: (tile: Tile) => void): void {
		this.onTileRemoval = callback;
	}

	setOnSubmitPress(callback: (rect: Konva.Rect) => void): void {
		this.onSubmitPress = callback;
	}

	// update the score
	updateScore(score: number): void {
		this.scoreText.text(`Score: ${score}`);
		this.group.getLayer()?.draw();
	}

	/**
	 * Update timer display
	 */
	updateTimer(timeRemaining: number): void {
		this.timerText.text(`Time: ${timeRemaining}`);
		this.group.getLayer()?.draw();
	}

	/**
	 * Show the screen
	 */
	show(): void {
		this.group.visible(true);
		this.group.getLayer()?.draw();
		this.startEquationPulsate();
		this.startBossNumPulsate();
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

	//using konva animations, blue component goes 0->180->0, with a period of 3s
	startEquationPulsate(): void {
		if (this.equationPulseAnim) return;

		const text = this.entryEquationText;
		if (!text) return;

		let t = 0;

		this.equationPulseAnim = new Konva.Animation((frame) => {
			if (!frame) return;

			t += frame.timeDiff / 500;

			// Multiplier goes 0 → 1 → 0 → ...
			const mix = 0.5 + 0.5 * Math.sin(t);

			// Black -> Dark Blue (0,0,180)
			const r = 0;
			const g = 0;
			const b = Math.floor(180 * mix);

			text.fill(`rgb(${r},${g},${b})`);
		}, text.getLayer());

		this.equationPulseAnim.start();
	}

	stopEquationPulsate(): void {
		if (this.equationPulseAnim) {
			this.equationPulseAnim.stop();
			this.equationPulseAnim = undefined;
			// reset the color
			this.entryEquationText.fill("black");
			this.entryEquationText.getLayer()?.draw();
		}
	}

	startBossNumPulsate(): void {
		if (this.bossNumPulseAnim) return; // already pulsing

		const text = this.bossNumber;
		if (!text) return;

		let t = 0;
		this.bossNumPulseAnim = new Konva.Animation((frame) => {
			t += frame.timeDiff / 100;
			// Flash between white and red
			const intensity = Math.floor(255 * (0.5 + 0.5 * Math.sin(t)));
			text.fill(`rgb(255, ${255 - intensity}, ${255 - intensity})`);
		}, text.getLayer());

		this.bossNumPulseAnim.start();
	}

	stopBossNumPulsate(): void {
		if (this.bossNumPulseAnim) {
			this.bossNumPulseAnim.stop();
			this.bossNumPulseAnim = undefined;
			// reset color
			this.bossNumber.fill("black");
			this.bossNumber.getLayer()?.draw();
		}
	}

	flashEquationGreen(duration: number = 1000, flashes: number = 3): void {
		if (!this.entryEquationText) return;
		this.stopEquationPulsate();

		const text = this.entryEquationText;
		const originalColor = text.fill();
		const interval = duration / (flashes * 2);
		let count = 0;

		const flashInterval = setInterval(() => {
			text.fill(count % 2 === 0 ? '#58b85a' : originalColor);
			this.group.getLayer()?.draw();

			count++;
			if (count >= flashes * 2) {
				clearInterval(flashInterval);
				text.fill(originalColor);
				this.group.getLayer()?.draw();
			}
		}, interval);

		setTimeout(() => this.startEquationPulsate(), 1000);
	}

	flashEquationRed(duration: number = 1000, flashes: number = 3): void {
		if (!this.entryEquationText) return;
		this.stopEquationPulsate();

		const text = this.entryEquationText;
		const originalColor = text.fill();
		const interval = duration / (flashes * 2);
		let count = 0;

		const flashInterval = setInterval(() => {
			text.fill(count % 2 === 0 ? '#bd2c19' : originalColor);
			this.group.getLayer()?.draw();

			count++;
			if (count >= flashes * 2) {
				clearInterval(flashInterval);
				text.fill(originalColor);
				this.group.getLayer()?.draw();
			}
		}, interval);

		setTimeout(() => this.startEquationPulsate(), 1000);
	}

	updateBossNum(newnum: string): void {
		if (!this.bossNumber) return;

		this.bossNumber.setText(newnum);
		this.group.getLayer()?.draw();
	}

	getBossNum(): number {
		if (!this.bossNumber) return NaN;

		return parseInt(this.bossNumber.text());

	}

	updateBossImage(path: string): void {
		const img = new Image();
		img.onload = () => {
			if (this.bossImageNode) {
				this.bossImageNode.image(img); // update existing node
			} else {
				this.bossImageNode = new Konva.Image({
					x: STAGE_WIDTH / 2 - 100,
					y: 50,
					image: img,
					width: 200,
					height: 200,
				});
				this.group.add(this.bossImageNode);
				this.bossImageNode.zIndex(1);
			}
			this.group.getLayer()?.draw();
		};
		img.src = path;
	}

	updateHealth(numHearts: number): void {
		const HEART_PATH = "src/assets/heart.png";

		const img = new Image();
		img.onload = () => {
			// Remove old hearts
			this.hearts.forEach(h => h.destroy());
			this.hearts = [];

			const heartSize = 40;
			const spacing = 0;
			const startX = 20;
			const startY = 70;

			for (let i = 0; i < numHearts; i++) {
				const heartNode = new Konva.Image({
					x: startX + i * (heartSize + spacing),
					y: startY,
					image: img,
					width: heartSize,
					height: heartSize,
				});
				this.group.add(heartNode);
				this.hearts.push(heartNode);
			}

			this.group.getLayer()?.draw();
		};

		img.onerror = () => console.error("Failed to load heart image:", HEART_PATH);
		img.src = HEART_PATH;
	}

	updatePhaseTiles(newParts: string[]): void {
		// Remove old tiles from the stage
		this.tiles.forEach(tile => tile.getNode().destroy());
		this.tiles = [];

		// Save new tile labels
		//this.parts = newParts;

		// Rebuild inventory tile layout
		const invWidth = this.inventory.width();
		const invHeight = this.inventory.height();
		const invX = this.inventory.x();
		const invY = this.inventory.y();

		const numTiles = newParts.length;
		const sideMargin = invWidth * 0.05;
		const availableWidth = invWidth - 2 * sideMargin;

		let tileSize = availableWidth / (numTiles + 0.2 * (numTiles - 1));
		let tileSpacing = tileSize * 0.2;

		if (tileSize > invHeight * 0.6) {
			tileSize = invHeight * 0.6;
			tileSpacing = tileSize * 0.2;
		}

		const totalWidth = numTiles * tileSize + (numTiles - 1) * tileSpacing;
		const startX = invX + (invWidth - totalWidth) / 2;
		const startY = invY + (invHeight - tileSize) / 2;

		//shuffle the tiles (Fisher-Yates)
		for (let i = newParts.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[newParts[i], newParts[j]] = [newParts[j], newParts[i]]; // Swap elements
		}

		// Create the tiles
		newParts.forEach((label, index) => {
			const x = startX + index * (tileSize + tileSpacing);
			const y = startY;

			const tile = new Tile(label, x, y, tileSize);
			this.group.add(tile.getNode());
			this.tiles.push(tile);

			// Reattach drag logic
			const node = tile.getNode();
			node.on("dragend", () => {
				if (this.isInsideEntryBox(node)) {
					if (this.onTileEntry) this.onTileEntry(tile);
				} else {
					if (this.onTileRemoval) this.onTileRemoval(tile);
				}
				this.group.getLayer()?.draw();
			});
		});

		this.group.getLayer()?.draw();
	}

	/* 
		Show a game over menu with the option to return back to screen
	*/
	showGameOver(): void {

		this.gameOverGroup?.destroy();

		const g = new Konva.Group({
			x: 0, 
			y: 0,
			name: 'gameOverOverlay'
		});
		this.gameOverGroup = g;

		const text = new Konva.Text({
			x: 0,
			y: STAGE_HEIGHT / 2 - 100,
			width: STAGE_WIDTH,
			align: "center",
			text: "GAME OVER",
			fontSize: 150,
			fontFamily: "Calibri",
			fontStyle: "bold",
			fill: "red"
		});

		g.add(text);
		// ADD the QUIT BUTTON

		const quitGroup = new Konva.Group({
			x: STAGE_WIDTH / 2 - 100,
			y: STAGE_HEIGHT / 2,
			cursor: "pointer",
		});

		const quitRect = new Konva.Rect({
			x: 0,
			y: 0,
			width: 200,
			height: 60,
			fill: "#e74c3c",
			stroke: "#c0392b",
			strokeWidth: 3,
			cornerRadius: 10,
		});

		const quitText = new Konva.Text({
			x: 0,
			y: 0,
			width: 200,
			height: 60,
			text: "Quit to Tower",
			fontSize: 24,
			fontFamily: "Arial",
			fill: "white",
			align: "center",
			verticalAlign: "middle",
			fontStyle: "bold",
			listening: false,
		});

		quitGroup.add(quitRect);
		quitGroup.add(quitText);

		quitGroup.on("click", () => {
			this.hideGameOver();
			if (this.onQuitClick) this.onQuitClick();
		});

		quitGroup.on("mouseover", () => {
			document.body.style.cursor = "pointer";
			quitRect.fill("#c0392b");
			this.group.getLayer()?.draw();
		});

		quitGroup.on("mouseout", () => {
			document.body.style.cursor = "default";
			quitRect.fill("#e74c3c");
			this.group.getLayer()?.draw();
		});
		
		g.add(quitGroup);

		this.group.add(g);
		g.moveToTop();
		this.group.getLayer()?.draw();
	}

	//Pause Overlay
	showPauseOverlay(): void {
		if (this.pauseOverlay) return; // Already shown
		this.pauseButton?.hide();

		this.pauseOverlay = new Konva.Rect({
			x: 0,
			y: 0,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
			fill: "black",
			opacity: 0.6,
		});

		this.pauseCloseBtn = new Konva.Text({
			x: STAGE_WIDTH - 80,
			y: 90,
			text: "X",
			fontSize: 50,
			fontFamily: "Arial",
			fill: "red",
			cursor: "pointer",
			fontStyle: "bold"
		});

		this.pauseCloseBtn.on("click", () => {
			if (this.onPauseClick) this.onPauseClick();
		});

		this.pauseCloseBtn.on("mouseover", () => {
			document.body.style.cursor = "pointer";
			if (this.pauseCloseBtn) this.pauseCloseBtn.fill("darkred");
			this.group.getLayer()?.draw();
		});

		this.pauseCloseBtn.on("mouseout", () => {
			document.body.style.cursor = "default";
			if (this.pauseCloseBtn) this.pauseCloseBtn.fill("red");
			this.group.getLayer()?.draw();
		});

		const quitGroup = new Konva.Group({
			x: STAGE_WIDTH / 2 - 100,
			y: STAGE_HEIGHT / 2 - 25,
			cursor: "pointer",
		});

		const quitRect = new Konva.Rect({
			x: 0,
			y: 0,
			width: 200,
			height: 60,
			fill: "#e74c3c",
			stroke: "#c0392b",
			strokeWidth: 3,
			cornerRadius: 10,
		});

		const quitText = new Konva.Text({
			x: 0,
			y: 0,
			width: 200,
			height: 60,
			text: "Quit to Tower",
			fontSize: 24,
			fontFamily: "Arial",
			fill: "white",
			align: "center",
			verticalAlign: "middle",
			fontStyle: "bold",
			listening: false,
		});

		quitGroup.on("click", () => {
			if (this.onQuitClick) this.onQuitClick();
		});

		quitGroup.on("mouseover", () => {
			document.body.style.cursor = "pointer";
			quitRect.fill("#c0392b");
			this.group.getLayer()?.draw();
		});

		quitGroup.on("mouseout", () => {
			document.body.style.cursor = "default";
			quitRect.fill("#e74c3c");
			this.group.getLayer()?.draw();
		});

		quitGroup.add(quitRect);
		quitGroup.add(quitText);
		this.quitBtn = quitGroup;

		// Add PAUSED text
		const pausedText = new Konva.Text({
			x: 0,
			y: STAGE_HEIGHT / 2 - 100,
			width: STAGE_WIDTH,
			text: "PAUSED",
			fontSize: 80,
			fontFamily: "Arial",
			fill: "white",
			align: "center",
			fontStyle: "bold",
		});

		// Add everything to the stage
		this.group.add(this.pauseOverlay);
		this.group.add(pausedText);
		this.group.add(this.pauseCloseBtn);
		this.group.add(this.quitBtn);
		// Make sure they're on top
		this.pauseOverlay.moveToTop();
		pausedText.moveToTop();
		this.pauseCloseBtn.moveToTop();
		this.quitBtn.moveToTop();

		this.group.getLayer()?.draw();
	}

	hidePauseOverlay(): void {
		this.pauseButton?.show();
		this.pauseOverlay?.destroy();
		this.pauseCloseBtn?.destroy();
		this.quitBtn?.destroy();

		this.pauseOverlay = undefined;
		this.pauseCloseBtn = undefined;
		this.quitBtn = undefined;

		this.group.getLayer()?.draw();
	}

	hideGameOver(): void {
		this.gameOverGroup?.destroy();
		this.gameOverGroup = undefined;

		this.group.getLayer()?.draw();
	}


}