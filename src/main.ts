import Konva from "konva";
import type { ScreenSwitcher, Screen } from "./types.ts";

import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants.ts";
import { BasicGameScreenController } from "./screens/BasicGameScreen/BasicGameScreenController.ts";
import { BossGameScreenController } from "./screens/BossGameScreen/BossGameScreenController.ts";
import { TowerSelectScreenController } from "./screens/TowerSelectScreen/TowerSelectScreenController.ts";
import { LoginScreenController } from "./screens/LoginScreen/LoginScreenController.ts";
import { SpeedGameScreenController } from "./screens/SpeedGameScreen/SpeedGameScreenController.ts";

/**
 * Main Application - Coordinates all screens
 *
 * This class demonstrates screen management using Konva Groups.
 * Each screen (4 x ) has its own Konva.Group that can be
 * shown or hidden independently.
 *
 * Key concept: All screens are added to the same layer, but only one is
 * visible at a time. This is managed by the switchToScreen() method.
 */

class App implements ScreenSwitcher {
	private stage: Konva.Stage;
	private layer: Konva.Layer;

	private basicgamecontroller: BasicGameScreenController;
	private bossgamecontroller: BossGameScreenController;
	private towerselectcontroller: TowerSelectScreenController;
	private logincontroller: LoginScreenController;
	private speedgamecontroller: SpeedGameScreenController;

	constructor(container: string) {
		// Initialize Konva stage (the main canvas)
		this.stage = new Konva.Stage({
			container,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
		});

		window.addEventListener("resize", () => {
			const stage = Konva.stages?.[0];
			if (stage) {
				stage.width(window.innerWidth);
				stage.height(window.innerHeight);
				stage.draw();
			}
		});

		// Create a layer (screens will be added to this layer)
		this.layer = new Konva.Layer();
		this.stage.add(this.layer);

		// Initialize all screen controllers
		// Each controller manages a Model, View, and handles user interactions
		this.basicgamecontroller = new BasicGameScreenController(this);
		this.bossgamecontroller = new BossGameScreenController(this);
		this.towerselectcontroller = new TowerSelectScreenController(this);
		this.logincontroller = new LoginScreenController(this);
		this.speedgamecontroller = new SpeedGameScreenController(this);


		// Add all screen groups to the layer
		// All screens exist simultaneously but only one is visible at a time
		this.layer.add(this.basicgamecontroller.getView().getGroup());
		this.layer.add(this.bossgamecontroller.getView().getGroup());
		this.layer.add(this.towerselectcontroller.getView().getGroup());
		this.layer.add(this.logincontroller.getView().getGroup());
		this.layer.add(this.speedgamecontroller.getView().getGroup());


		// Draw the layer (render everything to the canvas)
		this.layer.draw();

		// Start with tower selection screen visible
		this.switchToScreen({ type: "tower_select" });
	}

	/**
	 * Switch to a different screen
	 *
	 * This method implements screen management by:
	 * 1. Hiding all screens (setting their Groups to invisible)
	 * 2. Showing only the requested screen
	 *
	 * This pattern ensures only one screen is visible at a time.
	 */
	switchToScreen(screen: Screen): void {
		// Hide all screens first by setting their Groups to invisible
		this.basicgamecontroller.hide();
		this.bossgamecontroller.hide();
		this.towerselectcontroller.hide();
		this.logincontroller.hide();
		this.speedgamecontroller.hide();


		// Show the requested screen based on the screen type
		switch (screen.type) {
			case "basic_game":
				this.basicgamecontroller.show();
				break;
			case "boss_game":
				let curr_tower = this.basicgamecontroller.getTower();
				// this.bossgamecontroller.equationMode = this.bossgamecontroller.getEquationModeForTower(curr_tower);
				this.bossgamecontroller.setTower(curr_tower);
				this.bossgamecontroller.resetEq();
				this.bossgamecontroller.show();
				this.bossgamecontroller.startGame();
				break;
			case "tower_select":
				this.towerselectcontroller.show();
				break;
			case "login":
				this.logincontroller.show();
				break;
			case "speed_game":
				this.speedgamecontroller.show();
				this.speedgamecontroller.startGame();

			//add more cases as we go
		}
	}

	setCurrentTower(tower: number): void {
		this.basicgamecontroller.setTower(tower);
	}
}

// Initialize the application
new App("container");
