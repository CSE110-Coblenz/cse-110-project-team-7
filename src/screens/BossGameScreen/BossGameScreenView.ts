import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import { Tile } from "./Tile.ts"

/**
 * GameScreenView - Renders the game UI using Konva
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

	private onTileEntry?: (tile: Tile) => void;
	private onTileRemoval?: (tile: Tile) => void;

	private onSubmitPress?: (rect: Konva.Rect) => void;

	private equationPulseAnim?: Konva.Animation;
	private bossNumPulseAnim?: Konva.Animation;

	constructor() {
		this.group = new Konva.Group({ visible: false });

		const bg = new Konva.Rect({
			x: 0,
			y: 0,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
			fill: "#87CEEB", // Sky blue
		});
		this.group.add(bg);

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


		this.scoreText = new Konva.Text({
			x: 20,
			y: 20,
			text: "Score: 0",
			fontSize: 32,
			fontFamily: "Arial",
			fill: "black",
		});
		this.group.add(this.scoreText);

		this.timerText = new Konva.Text({
			x: STAGE_WIDTH - 150,
			y: 20,
			text: "Time: 30",
			fontSize: 32,
			fontFamily: "Arial",
			fill: "red",
		});
		this.group.add(this.timerText);

		// ===== Entry Box (bottom-left quadrant) =====
		this.entryBox = new Konva.Rect({
			x: 0, // left edge
			y: STAGE_HEIGHT / 2 + 50, // start halfway down
			width: STAGE_WIDTH / 2,
			height: STAGE_HEIGHT / 2 - 50,
			fill: "#aeffaaff",
			stroke: "black",
			strokeWidth: 3,
			cornerRadius: 10,
		});
		this.group.add(this.entryBox);

		//small text box that shows the inputted equation
		this.entryEquationText = new Konva.Text({
			x: STAGE_WIDTH / 2 - 50,
			y: this.entryBox.y() - 60, // just above the "Entry Box" label
			width: this.entryBox.width() - 20,
			align: "left",
			text: "Current: ",
			fontSize: 50,
			fontFamily: "Impact",
			fill: "white",
		});
		this.group.add(this.entryEquationText);

		// submission 
		this.submitRect = new Konva.Rect({
			x: STAGE_WIDTH / 2 - 300,
			y: this.entryBox.y() - 60,
			width: 200,
			height: 50,
			fill: "#c1c1c1ff",
			stroke: "black",
			strokeWidth: 3,
			cornerRadius: 1
		})
		this.group.add(this.submitRect);

		this.submitRect.on('click', () => {
			console.log("submission presssed");
			if (this.onSubmitPress) this.onSubmitPress(this.submitRect);
		});

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

		// Inventory (bottom-right quadrant)
		this.inventory = new Konva.Rect({
			x: STAGE_WIDTH / 2, // right half
			y: STAGE_HEIGHT / 2 + 50, // bottom half
			width: STAGE_WIDTH / 2,
			height: STAGE_HEIGHT / 2 - 50,
			fill: "#d2b48c", // tan
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

	//update the score
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

	startEquationPulsate(): void {
		console.log("starting equation pulsate");
		if (this.equationPulseAnim) return; // already pulsing

		const text = this.entryEquationText;
		if (!text) return;

		let t = 0;
		this.equationPulseAnim = new Konva.Animation((frame) => {
			t += frame.timeDiff / 500;
			const r = 255;
			const g = 255;
			const b = Math.floor(255 * (0.5 + 0.5 * Math.sin(t)));
			text.fill(`rgb(${r},${g},${b})`);
		}, text.getLayer());

		this.equationPulseAnim.start();
	}

	stopEquationPulsate(): void {
		if (this.equationPulseAnim) {
			this.equationPulseAnim.stop();
			this.equationPulseAnim = undefined;
			// optional: reset the color
			this.entryEquationText.fill("white");
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
			this.bossNumber.fill("black"); // reset color
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
			text.fill(count % 2 === 0 ? 'green' : originalColor);
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

	flashEquationRed(duration: number = 1000, flashes: number = 3): void{
		if (!this.entryEquationText) return;
		this.stopEquationPulsate();

		const text = this.entryEquationText;
		const originalColor = text.fill();
		const interval = duration / (flashes * 2);
		let count = 0;

		const flashInterval = setInterval(() => {
			text.fill(count % 2 === 0 ? 'red' : originalColor);
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
			const spacing = 10;
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


}
