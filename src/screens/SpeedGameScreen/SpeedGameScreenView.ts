import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import { SPEED_GAME_DURATION } from "../../constants.ts";

export class SpeedGameScreenView implements View {
	private group: Konva.Group;
	private background: Konva.Rect;
	private questionText: Konva.Text;
	private scoreText: Konva.Text;
	private timerText: Konva.Text;
	private inputText: Konva.Text;
	private inputBox: Konva.Rect;
	private feedbackText: Konva.Text;
	private gameOverGroup?: Konva.Group;
	private ReturnToMenu?: Konva.Group;

	private onSubmit?: (answer: number) => void;
	private onRestart?: () => void;
	private onMenu?: () => void;

	constructor() {
		this.group = new Konva.Group({ visible: false });

		// Background that will change color
		this.background = new Konva.Rect({
			x: 0,
			y: 0,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
			fill: '#e8f4f8',
		});
		this.group.add(this.background);

		// Score display
		this.scoreText = new Konva.Text({
			x: 20,
			y: 20,
			text: 'Score: 0',
			fontSize: 32,
			fontFamily: 'Arial',
			fill: 'black',
			fontStyle: 'bold',
		});
		this.group.add(this.scoreText);

		// Timer display
		this.timerText = new Konva.Text({
			x: STAGE_WIDTH - 150,
			y: 20,
			text: `Time: ${SPEED_GAME_DURATION}`,
			fontSize: 32,
			fontFamily: 'Arial',
			fill: 'black',
			fontStyle: 'bold',
		});
		this.group.add(this.timerText);

		// Question display
		this.questionText = new Konva.Text({
			x: 0,
			y: STAGE_HEIGHT / 3,
			width: STAGE_WIDTH,
			text: '5 + 3 = ?',
			fontSize: 80,
			fontFamily: 'Arial',
			fill: 'black',
			align: 'center',
			fontStyle: 'bold',
		});
		this.group.add(this.questionText);

		// Input box
		this.inputBox = new Konva.Rect({
			x: STAGE_WIDTH / 2 - 150,
			y: STAGE_HEIGHT / 2 + 20,
			width: 300,
			height: 80,
			fill: 'white',
			stroke: 'black',
			strokeWidth: 3,
			cornerRadius: 10,
		});
		this.group.add(this.inputBox);

		// Input text display
		this.inputText = new Konva.Text({
			x: STAGE_WIDTH / 2 - 140,
			y: STAGE_HEIGHT / 2 + 40,
			width: 280,
			text: '',
			fontSize: 50,
			fontFamily: 'Arial',
			fill: 'black',
			align: 'center',
		});
		this.group.add(this.inputText);

		// Feedback text (correct/wrong)
		this.feedbackText = new Konva.Text({
			x: 0,
			y: STAGE_HEIGHT / 2 + 120,
			width: STAGE_WIDTH,
			text: '',
			fontSize: 40,
			fontFamily: 'Arial',
			fill: 'green',
			align: 'center',
			fontStyle: 'bold',
		});
		this.group.add(this.feedbackText);

		// Instructions
		const instructionsText = new Konva.Text({
			x: 0,
			y: STAGE_HEIGHT - 60,
			width: STAGE_WIDTH,
			text: 'Type your answer and press ENTER\n(progress here does not affect progress in the main game)',
			fontSize: 20,
			fontFamily: 'Arial',
			fill: '#333',
			align: 'center',
		});
		this.group.add(instructionsText);

		//return to menu
		const menuGroup = new Konva.Group({
			x: STAGE_WIDTH - 500,
			y: STAGE_HEIGHT - 200,
			cursor: 'pointer',
		});

		const menuRect = new Konva.Rect({
			x: 0,
			y: 0,
			width: 200,
			height: 60,
			fill: '#3498db',
			stroke: '#2980b9',
			strokeWidth: 3,
			cornerRadius: 10,
		});

		const menuText = new Konva.Text({
			x: 0,
			y: 0,
			width: 200,
			height: 60,
			text: 'Exit',
			fontSize: 28,
			fontFamily: 'Arial',
			fill: 'white',
			align: 'center',
			verticalAlign: 'middle',
			fontStyle: 'bold',
			listening: false,
		});
		this.ReturnToMenu = menuGroup;

		menuGroup.on("click", () => {
			if (this.onMenu) this.onMenu();
		});

		menuGroup.on("mouseover", () => {
			document.body.style.cursor = "pointer";
		});

		menuGroup.on("mouseout", () => {
			document.body.style.cursor = "default";
		});

		menuGroup.add(menuRect);
		menuGroup.add(menuText);
		this.group.add(menuGroup);
	}

	setOnSubmit(callback: (answer: number) => void): void {
		this.onSubmit = callback;
	}

	setOnRestart(callback: () => void): void {
		this.onRestart = callback;
	}

	setOnMenu(callback: () => void): void {
		this.onMenu = callback;
	}

	updateQuestion(a: number, b: number, op: string): void {
		this.questionText.text(`${a} ${op} ${b} = ?`);
		this.group.getLayer()?.draw();
	}

	updateScore(score: number): void {
		this.scoreText.text(`Score: ${score}`);
		this.group.getLayer()?.draw();
	}

	updateTimer(timeRemaining: number): void {
		console.log("updating timer speed game");
		this.timerText.text(`Time: ${timeRemaining}`);
		this.group.getLayer()?.draw();
	}

	updateInput(text: string): void {
		this.inputText.text(text);
		this.group.getLayer()?.draw();
	}

	clearInput(): void {
		this.inputText.text('');
		this.group.getLayer()?.draw();
	}

	showFeedback(correct: boolean): void {
		this.feedbackText.text(correct ? '✓ Correct!' : '✗ Wrong!');
		this.feedbackText.fill(correct ? '#2ecc71' : '#e74c3c');
		this.group.getLayer()?.draw();

		setTimeout(() => {
			this.feedbackText.text('');
			this.group.getLayer()?.draw();
		}, 800);
	}

	updateBackgroundColor(timeRemaining: number): void {
		const ratio = timeRemaining / SPEED_GAME_DURATION;

		// Start: light blue (#e8f4f8 = 232, 244, 248)
		// End: dark red (#8b0000 = 139, 0, 0)
		const r = Math.floor(232 + (139 - 232) * (1 - ratio));
		const g = Math.floor(244 + (0 - 244) * (1 - ratio));
		const b = Math.floor(248 + (0 - 248) * (1 - ratio));

		this.background.fill(`rgb(${r}, ${g}, ${b})`);
		this.group.getLayer()?.draw();
	}

	showGameOver(finalScore: number): void {
		this.gameOverGroup?.destroy();

		const g = new Konva.Group({
			x: 0,
			y: 0,
		});
		this.gameOverGroup = g;

		// Semi-transparent overlay
		const overlay = new Konva.Rect({
			x: 0,
			y: 0,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
			fill: 'black',
			opacity: 0.7,
		});
		g.add(overlay);

		// Game over text
		const gameOverText = new Konva.Text({
			x: 0,
			y: STAGE_HEIGHT / 2 - 150,
			width: STAGE_WIDTH,
			text: 'TIME\'S UP!',
			fontSize: 80,
			fontFamily: 'Arial',
			fill: 'white',
			align: 'center',
			fontStyle: 'bold',
		});
		g.add(gameOverText);

		// Final score
		const scoreText = new Konva.Text({
			x: 0,
			y: STAGE_HEIGHT / 2 - 50,
			width: STAGE_WIDTH,
			text: `Final Score: ${finalScore}`,
			fontSize: 50,
			fontFamily: 'Arial',
			fill: '#ffd700',
			align: 'center',
			fontStyle: 'bold',
		});
		g.add(scoreText);

		// Restart button
		const restartGroup = new Konva.Group({
			x: STAGE_WIDTH / 2 - 100,
			y: STAGE_HEIGHT / 2 + 50,
			cursor: 'pointer',
		});

		const restartRect = new Konva.Rect({
			x: 0,
			y: 0,
			width: 200,
			height: 60,
			fill: '#3498db',
			stroke: '#2980b9',
			strokeWidth: 3,
			cornerRadius: 10,
		});

		const restartText = new Konva.Text({
			x: 0,
			y: 0,
			width: 200,
			height: 60,
			text: 'Play Again',
			fontSize: 28,
			fontFamily: 'Arial',
			fill: 'white',
			align: 'center',
			verticalAlign: 'middle',
			fontStyle: 'bold',
			listening: false,
		});

		restartGroup.add(restartRect);
		restartGroup.add(restartText);

		restartGroup.on('click', () => {
			if (this.onRestart) this.onRestart();
		});

		restartGroup.on('mouseover', () => {
			document.body.style.cursor = 'pointer';
			restartRect.fill('#2980b9');
			this.group.getLayer()?.draw();
		});

		restartGroup.on('mouseout', () => {
			document.body.style.cursor = 'default';
			restartRect.fill('#3498db');
			this.group.getLayer()?.draw();
		});

		g.add(restartGroup);

		this.group.add(g);
		g.moveToTop();
		this.ReturnToMenu?.moveToTop();
		this.group.getLayer()?.draw();
	}

	hideGameOver(): void {
		this.gameOverGroup?.destroy();
		this.gameOverGroup = undefined;
		this.group.getLayer()?.draw();
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

	triggerSubmit(): void {
		const answer = parseInt(this.inputText.text());
		if (!isNaN(answer) && this.onSubmit) {
			this.onSubmit(answer);
		}
	}
}