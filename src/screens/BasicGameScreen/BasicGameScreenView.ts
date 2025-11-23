import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import { generateEquation } from "../../utils/generateEquation.ts";
import type { KonvaNodeEvent } from "konva/lib/types";
import { Stage } from "konva/lib/Stage";
import { BossGameScreenView } from "../BossGameScreen/BossGameScreenView.ts";
import { evaluate } from "../../utils/equationSolver.ts";

let bossScreen: BossGameScreenView | null = null;

/**
 * GameScreenView - Renders the game UI using Konva
 */

let equationMode: "any" | "addition" | "subtraction" | "multiplication" | "division" = "any";

export let correctAnswers = 0;
export const MAX_LEVELS = 20;


const questions = generateQuestionSet();

function generateQuestionSet() {
	const questions = [];

	for (let i = 0; i < 5; i++) {
		const target = Math.floor(Math.random() * 30);
		const eqs = generateEquation(target, 3, 5);
		if (eqs.length === 0) {
			i--;
			continue;
		}

		const eq = eqs[Math.floor(Math.random() * eqs.length)];
		const answer = evaluate(eq).toString();

		const wrong: string[] = [];
		while (wrong.length < 3) {
			const fake = generateFakeOption();
			if (fake !== answer && !wrong.includes(fake)) wrong.push(fake);
		}

		const options = [eq, ...wrong].sort(() => Math.random() - 0.5);

		questions.push({
			equation: eq,
			answer,
			options
		});
	}

	return questions;
}


function generateFakeOption(): string {
	const a = Math.floor(Math.random() * 10);
	const b = Math.floor(Math.random() * 10);
	let ops: string[] = [];
	switch (equationMode) {
		case "addition":
			ops = ["+"];
			break;
		case "subtraction":
			ops = ["-"];
			break;
		case "multiplication":
			ops = ["*"];
			break;
		case "division":
			ops = ["/"];
			break;
		default:
			ops = ["+", "-", "*", "/"];
	}
	
	const op = ops[Math.floor(Math.random() * ops.length)];
	return `${a}${op}${b}`;
}

let currentQuestionIndex = 0;
let health = 3;

export class BasicGameScreenView implements View {
	private group: Konva.Group;
	private questionText: Konva.Text;
	private levelText: Konva.Text;
	private choiceButtons: Konva.Group[] = [];
	private monster?: Konva.Image;
	
    constructor() {
		this.group = new Konva.Group({ visible: false });

		// 1. Cobblestone Wall Background
		this.createCobblestoneWall();

		// 2. Stone Floor
		this.createStoneFloor();

		// 3. Add Lanterns
		this.createLantern(100, 150); // Left lantern
		this.createLantern(STAGE_WIDTH - 100, 150); // Right lantern

		// 4. Monster Image
		Konva.Image.fromURL('src/assets/monster.png', (monsterNode) => {
			this.monster = monsterNode;
			monsterNode.setAttrs({
				x: STAGE_WIDTH / 2.5,
				y: STAGE_HEIGHT * 0.05,
				scaleX: 0.5,
				scaleY: 0.5,
				cornerRadius: 20
			});
			this.group.add(monsterNode)
			this.group.getLayer()?.draw();
		});

		// 5. Hearts
		for (let i = 0; i < 3; i++){
			Konva.Image.fromURL('src/assets/heart.png', (heart) => {
				heart.setAttrs({
					x: 20 + i * 40,
					y: 20,
					scaleX: 0.15,
					scaleY: 0.15,
				});
				this.group.add(heart);
				this.hearts.push(heart);
				this.group.getLayer()?.draw();
			})
		}

		const helpGroup = new Konva.Group({
			x: STAGE_WIDTH - 70,
			y: 20,
			cursor: "pointer",
		});

		const helpBox = new Konva.Rect({
			width: 50,
			height: 50,
			fill: "lightblue",
			stroke: "blue",
			strokeWidth: 2,
			cornerRadius: 1,
			listening: true,
		});

		const helpText = new Konva.Text({
			text: "?",
			fontSize: 36,
			fontFamily: "Calibri",
			fill: "blue",
			width: 50,
			height: 50,
			align: "center",
			offsetY: -5,
			listening: false,
		});

		helpGroup.on("mouseover", () => {
			helpBox.fill("darkblue")
			this.group.getLayer()?.batchDraw();
		});

		helpGroup.on("mouseout", () => {
			helpBox.fill("lightblue")
			this.group.getLayer()?.batchDraw();
		});

		helpGroup.on("click", () => {
			this.showHelpPopup();
		});

		helpGroup.add(helpBox);
		helpGroup.add(helpText);
		this.group.add(helpGroup);

		this.levelText = new Konva.Text({
			x: STAGE_WIDTH - 250, // Adjusted for visibility on dark background
			y: STAGE_HEIGHT - 50,
			text: `Progress: ${correctAnswers}/${MAX_LEVELS}`,
			fontSize: 28,
			fontFamily: "Calibri",
			fill: "white", // White text for contrast
			shadowColor: "black",
			shadowBlur: 2,
		});
		this.group.add(this.levelText);

		this.questionText = new Konva.Text({
			x: 0,
			y: STAGE_WIDTH * 0.15,
			width: STAGE_WIDTH,
			text: "",
			fontSize: 48, // Larger font
			fontFamily: "Calibri",
			fill: "white", // White text
			align: "center",
			shadowColor: "black",
			shadowBlur: 4,
			fontStyle: "bold",
		});

		this.group.add(this.questionText);

		this.loadQuestion(currentQuestionIndex);
    }

	private createCobblestoneWall(): void {
		const width = STAGE_WIDTH || 800;
		const height = STAGE_HEIGHT || 600;

		// Base wall color
		const wallBg = new Konva.Rect({
			x: 0,
			y: 0,
			width: width,
			height: height,
			fill: "#34495e", // Dark base
		});
		this.group.add(wallBg);

		const rows = 20;
		const cols = 15;
		const brickWidth = width / cols;
		const brickHeight = height / rows;

		for (let r = 0; r < rows; r++) {
			for (let c = 0; c <= cols; c++) {
				// Offset every other row
				const xOffset = (r % 2 === 0) ? 0 : -brickWidth / 2;
				
				// Vary color slightly for texture
				const shade = Math.random() > 0.5 ? "#7f8c8d" : "#95a5a6";
				
				const brick = new Konva.Rect({
					x: c * brickWidth + xOffset,
					y: r * brickHeight,
					width: brickWidth - 2, // Gap for mortar
					height: brickHeight - 2,
					fill: shade,
					cornerRadius: 2,
					opacity: 0.8, // Let some base color through
				});
				this.group.add(brick);
			}
		}
	}

	private createStoneFloor(): void {
		const width = STAGE_WIDTH || 800;
		const height = STAGE_HEIGHT || 600;
		const floorHeight = 100;
		
		const floor = new Konva.Rect({
			x: 0,
			y: height - floorHeight,
			width: width,
			height: floorHeight,
			fill: "#2c3e50", // Dark slate floor
			stroke: "#1a252f",
			strokeWidth: 5,
		});
		this.group.add(floor);
	}

	private createLantern(x: number, y: number): void {
		// 1. Glow effect (behind)
		const glow = new Konva.Circle({
			x: x,
			y: y + 20,
			radius: 80,
			fillRadialGradientStartPoint: { x: 0, y: 0 },
			fillRadialGradientStartRadius: 0,
			fillRadialGradientEndPoint: { x: 0, y: 0 },
			fillRadialGradientEndRadius: 80,
			fillRadialGradientColorStops: [0, "rgba(255, 200, 0, 0.4)", 1, "rgba(0,0,0,0)"],
		});
		this.group.add(glow);

		// 2. Wall Bracket
		const bracket = new Konva.Line({
			points: [x, y, x, y - 20, x + 10, y - 20], // Hook shape
			stroke: "#2c3e50",
			strokeWidth: 4,
		});
		this.group.add(bracket);

		// 3. Lantern Body
		const lantern = new Konva.Rect({
			x: x - 15,
			y: y,
			width: 30,
			height: 40,
			fill: "rgba(255, 255, 0, 0.2)", // Glassy yellow
			stroke: "#2c3e50",
			strokeWidth: 3,
		});
		this.group.add(lantern);

		// 4. Flame
		const flame = new Konva.Circle({
			x: x,
			y: y + 20,
			radius: 8,
			fill: "#e67e22", // Orange core
			stroke: "#f1c40f", // Yellow rim
			strokeWidth: 2,
		});
		this.group.add(flame);
	}

	showHelpPopup() {
		const overlay = new Konva.Rect({
			x: 0,
			y: 0,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
			fill: "black",
			opacity: 0.6,
		});
	
		const popup = new Konva.Group({
			x: STAGE_WIDTH / 2 - 200,
			y: STAGE_HEIGHT / 2 - 150,
		});
	
		const box = new Konva.Rect({
			width: 400,
			height: 300,
			fill: "white",
			cornerRadius: 10,
			shadowColor: "black",
			shadowBlur: 10,
			shadowOpacity: 0.5,
		});
	
		const text = new Konva.Text({
			text: "How to play:\n\n1. Each monster has a number appear near them \n2. Select the answer with your mouse that has the correct equation to match.\n3. Be Careful! If you select the wrong answer, you’ll lose a life. Three strikes and you’re out...\n4. Keep defeating monsters to climb the tower.",
			width: 380,
			padding: 10,
			fontSize: 20,
			fontFamily: "Calibri",
			fill: "black",
			align: "left",
		});
	
		const closeBtn = new Konva.Text({
			x: 360,
			y: 10,
			text: "X",
			fontSize: 24,
			fontFamily: "Calibri",
			fill: "red",
			cursor: "pointer",
		});
	
		closeBtn.on("click", () => {
			popup.destroy();
			overlay.destroy();
			this.group.getLayer()?.draw();
		});
	
		popup.add(box);
		popup.add(text);
		popup.add(closeBtn);
	
		this.group.add(overlay);
		this.group.add(popup);
	
		overlay.moveToTop();
		popup.moveToTop();
		this.group.getLayer()?.draw();
	}
	

	private hearts: Konva.Image[] = [];
	updateHealth() {
		if (health <= 0) return;

		health--;

		const heart = this.hearts[health];
		heart.visible(false);
		this.group.getLayer()?.draw();

		if (health === 0){
			this.showGameOver();
		}
	}

	updateLevelText() {
		this.levelText.text(`Progress: ${correctAnswers}/${MAX_LEVELS}`);
		this.group.getLayer()?.draw();
	}

	showGameOver(){
		const text = new Konva.Text({
			x: 0,
			y: STAGE_HEIGHT / 2 - 50,
			width: STAGE_WIDTH,
			align: "center",
			text: "GAME OVER",
			fontSize: 60,
			fontFamily: "Calibri",
			fill: "red"
		});
		this.group.add(text);
		this.group.getLayer()?.draw();
		this.choiceButtons.forEach(btn => btn.off("click"));
	}

	loadQuestion(index: number){
		const question = questions[index];
		this.updateEquationText(`${question.answer}`, 20, 20);

		this.choiceButtons.forEach(btn => btn.destroy());
		this.choiceButtons = [];

		const buttonWidth = STAGE_WIDTH * 0.4;
		const buttonHeight = 60;
		const startY = STAGE_HEIGHT * 0.35;
		const spacing = 20;

		question.options.forEach((choice, i) => {
			const buttonGroup = new Konva.Group({
				x: STAGE_WIDTH / 2 - buttonWidth / 2,
				y: startY + i * (buttonHeight + spacing),
			});

			const rect = new Konva.Rect({
				width: buttonWidth,
				height: buttonHeight,
				fill: '#ddd',
				stroke: '#555',
				strokeWidth: 4,
				cornerRadius: 10,
				shadowColor: "black",
				shadowBlur: 5,
				shadowOpacity: 0.2,
			});
			
			const text = new Konva.Text({
				width: buttonWidth,
				height: buttonHeight,
				text: choice,
				fontSize: 24,
				fontFamily: "Calibri",
				fill: "black",
				align: "center",
				verticalAlign: "middle",
			});

			buttonGroup.on("mouseover", () => {
				rect.fill("#bbb");
				this.group.getLayer()?.batchDraw();
			});
			buttonGroup.on("mouseout", () => {
				rect.fill("#ddd");	
				this.group.getLayer()?.batchDraw();
			});

			buttonGroup.on("click", () => {
				this.handleAnswer(choice, rect);
			});

			buttonGroup.add(rect);
			buttonGroup.add(text);
			this.group.add(buttonGroup);
			this.choiceButtons.push(buttonGroup);
		});

		this.group.getLayer()?.draw();
	}

	async handleAnswer(selected: string, rect: Konva.Rect){
		const question = questions[currentQuestionIndex];

		if (selected === question.equation){
			correctAnswers++;
			this.updateLevelText();
			rect.fill("#58b85a");
			console.log("correct");
			this.updateMonsterImage('src/assets/monstersln.png')
			await this.sleep(2000);
			rect.fill("#ddd");
			this.updateMonsterImage('src/assets/monster.png')
			currentQuestionIndex++;

			if (correctAnswers >= MAX_LEVELS) {
				console.log("Switching to boss screen...");
	
				this.hide();
	
				if (!bossScreen) bossScreen = new BossGameScreenView();
				bossScreen.show();
	
				return;
			}

			if (currentQuestionIndex < questions.length) {
				this.loadQuestion(currentQuestionIndex);
			} else {
				console.log("finished")
			}

		} else {
			rect.fill("#bd2c19")
			console.log("wrong")
			this.updateMonsterImage('src/assets/monsteratk.png')
			this.updateHealth();
			await this.sleep(2000);
			this.updateMonsterImage('src/assets/monster.png')
		}
	}
	
	updateEquationText(text: string, x?: number, y?: number){
		this.questionText.text(text);

		if (x !== undefined) this.questionText.x(x);
		if (y !== undefined) this.questionText.y(y);

		this.group.getLayer()?.draw();
	}

	updateMonsterImage(newUrl: string){
		Konva.Image.fromURL(newUrl, (newMonster) => {
			if (this.monster) {
				newMonster.position(this.monster.position());
				newMonster.scale(this.monster.scale());
				newMonster.cornerRadius(20);
				this.monster.destroy();
			}
			this.monster = newMonster;
			this.group.add(newMonster);
			this.group.getLayer()?.draw();
		});
	}


	sleep(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
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