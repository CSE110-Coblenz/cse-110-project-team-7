import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import { Tile } from "./Tile.ts"

/**
 * GameScreenView - Renders the game UI using Konva
 */
export class BossGameScreenView implements View {
	private parts: string[] = ["1", "5", "x"]
	private group: Konva.Group;
	private scoreText: Konva.Text;
	private timerText: Konva.Text;
	private tiles: Tile[] = []

	private entryBox: Konva.Rect;
	private inventory: Konva.Rect;

	private entryEquationText: Konva.Text;

	private onTileEntry?: (tile: Tile) => void;
	private onTileRemoval?: (tile: Tile) => void;

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
			text: "Time: 60",
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
			fill: "#f4f4f4",
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
			fontSize: 22,
			fontFamily: "Impact",
			fill: "darkblue",
		});
		this.group.add(this.entryEquationText);

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

		// ===== Inventory (bottom-right quadrant) =====
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

		// ===== Tiles go inside the inventory box =====

		// Compute how much horizontal space we have
		const invWidth = this.inventory.width();
		const invHeight = this.inventory.height();
		const invX = this.inventory.x();
		const invY = this.inventory.y();

		const numTiles = this.parts.length;

		// Define a reasonable margin ratio
		const sideMargin = invWidth * 0.05; // 5% margin on each side
		const availableWidth = invWidth - 2 * sideMargin;

		// Compute ideal spacing: each tile + gap between
		// Let’s assume we want small gaps proportional to tile size
		// So tileSize + spacing = availableWidth / numTiles
		// and we’ll make spacing = tileSize * 0.2 → solve for tileSize
		let tileSize = availableWidth / (numTiles + 0.2 * (numTiles - 1));
		let tileSpacing = tileSize * 0.2;

		// Also ensure the tile fits vertically
		if (tileSize > invHeight * 0.6) {
			tileSize = invHeight * 0.6;
			tileSpacing = tileSize * 0.2;
		}

		// Compute top-left start so everything is centered
		const totalWidth = numTiles * tileSize + (numTiles - 1) * tileSpacing;
		const startX = invX + (invWidth - totalWidth) / 2;
		const startY = invY + (invHeight - tileSize) / 2;

		// Create and place tiles
		this.parts.forEach((part, index) => {
			const x = startX + index * (tileSize + tileSpacing);
			const y = startY;

			const tile = new Tile(part, x, y, tileSize);
			this.group.add(tile.getNode());
			this.tiles.push(tile);
		});

		this.tiles.forEach(tile => {
			const node = tile.getNode();

			node.on("dragend", () => {
				if (this.isInsideEntryBox(node)) {
					// console.log(`${tile.getLabel()} dropped inside entry box`);
					// You can snap it into position or trigger logic here
					if (this.onTileEntry) {
						this.onTileEntry(tile);
					}
					this.group.getLayer()?.draw();
				} else {
					console.log(`${tile.getLabel()} dropped outside entry box`);
					if (this.onTileRemoval) {
						this.onTileRemoval(tile)
					}
				}
			});
		});
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
