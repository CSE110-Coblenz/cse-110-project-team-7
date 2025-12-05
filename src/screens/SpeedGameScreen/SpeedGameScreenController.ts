import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { SpeedGameScreenModel } from "./SpeedGameScreenModel.ts";
import { SpeedGameScreenView } from "./SpeedGameScreenView.ts";
import { SPEED_GAME_DURATION } from "../../constants.ts";

export class SpeedGameScreenController extends ScreenController {
	private model: SpeedGameScreenModel;
	private view: SpeedGameScreenView;
	private screenSwitcher: ScreenSwitcher;
	private gameTimer: number | null = null;
	private currentInput: string = '';
	private isGameActive: boolean = false;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;
		this.model = new SpeedGameScreenModel();
		this.view = new SpeedGameScreenView();

		this.view.setOnSubmit((answer: number) => {
			this.handleSubmit(answer);
		});

		this.view.setOnRestart(() => {
			this.startGame();
		});

		this.view.setOnMenu(() => {
			this.returnToMenu();
		})

		this.setupKeyboardInput();
	}

	private setupKeyboardInput(): void {
		window.addEventListener('keydown', (e) => {
			if (!this.isGameActive) return;

			if (e.key >= '0' && e.key <= '9') {
				this.currentInput += e.key;
				this.view.updateInput(this.currentInput);
			} else if (e.key === 'Backspace') {
				this.currentInput = this.currentInput.slice(0, -1);
				this.view.updateInput(this.currentInput);
			} else if (e.key === 'Enter' && this.currentInput !== '') {
				this.view.triggerSubmit();
			} else if (e.key === '-' && this.currentInput === '') {
				this.currentInput = '-';
				this.view.updateInput(this.currentInput);
			}
		});
	}

	private handleSubmit(answer: number): void {
		const correct = this.model.checkAnswer(answer);

		if (correct) {
			this.model.addScore(10);
			this.view.updateScore(this.model.getScore());
		} else {
			this.model.decrementScore(8);
			this.view.updateScore(this.model.getScore());
		}

		this.view.showFeedback(correct);
		this.currentInput = '';
		this.view.clearInput();

		// Generate next question
		this.model.generateQuestion();
		const question = this.model.getCurrentQuestion();
		if (question) {
			this.view.updateQuestion(question.a, question.b, question.op);
		}
	}

	startGame(): void {
		this.model.reset();
		this.currentInput = '';
		this.isGameActive = true;

		this.view.hideGameOver();
		this.view.updateScore(0);
		this.view.updateTimer(SPEED_GAME_DURATION);
		this.view.clearInput();
		this.view.updateBackgroundColor(SPEED_GAME_DURATION);

		// Generate first question
		this.model.generateQuestion();
		const question = this.model.getCurrentQuestion();
		if (question) {
			this.view.updateQuestion(question.a, question.b, question.op);
		}

		this.view.show();
		this.startTimer();
	}

	/*
		Start the timer
	*/
	private startTimer(): void {
		this.gameTimer = setInterval(() => {
			const timeRemaining = this.model.tickTimer();
			this.view.updateTimer(timeRemaining);
			this.view.updateBackgroundColor(timeRemaining);

			if (timeRemaining <= 0) {
				this.endGame();
			}
		}, 1000);
	}

	private stopTimer(): void {
		if (this.gameTimer !== null) {
			clearInterval(this.gameTimer);
			this.gameTimer = null;
		}
	}

	private endGame(): void {
		this.stopTimer();
		this.isGameActive = false;
		const finalScore = this.model.getScore();
		this.view.showGameOver(finalScore);
	}

	getView(): SpeedGameScreenView {
		return this.view;
	}

	returnToMenu(){
		this.endGame();
		this.screenSwitcher.switchToScreen({type: "tower_select"});
	}
}