import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import { Tile } from "./Tile.ts"

let parts: string[] = ["1", "5", "x", "="]

/**
 * GameScreenView - Renders the game UI using Konva
 */
export class BossGameScreenView implements View {
	private group: Konva.Group;
	private scoreText: Konva.Text;
	private timerText: Konva.Text;
	private tiles: Tile[] = []

	private entryBox: Konva.Rect;
	private inventory: Konva.Rect;

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
		const tileSize = 80;
		const tileSpacing = 20;

		// place tiles in the middle of the inventory area
		const inventoryCenterX = this.inventory.x() + this.inventory.width() / 2;
		const inventoryCenterY = this.inventory.y() + this.inventory.height() / 2;

		const totalWidth = parts.length * tileSize + (parts.length - 1) * tileSpacing;
		let startX = inventoryCenterX - totalWidth / 2;
		let startY = inventoryCenterY - tileSize / 2;

		parts.forEach((part, index) => {
			const tile = new Tile(
				part,
				startX + index * (tileSize + tileSpacing),
				startY,
				tileSize
			);
			this.group.add(tile.getNode());
			this.tiles.push(tile);
		});

		this.tiles.forEach(tile => {
			const node = tile.getNode();

			node.on("dragend", () => {
				if (this.isInsideEntryBox(node)) {
					console.log(`${tile.getLabel()} dropped inside entry box`);
					// You can snap it into position or trigger logic here
					if (this.onTileEntry) {
						this.onTileEntry(tile); // ✅ Pass the full Tile object
					}
					this.group.getLayer()?.draw();
				} else {
					console.log(`${tile.getLabel()} dropped outside entry box`);
					if (this.onTileRemoval){
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

	setOnTileEntry(callback: (tile: Tile) => void): void {
		this.onTileEntry = callback;
	}

	setOnTileRemoval(callback: (tile: Tile) => void): void{
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
