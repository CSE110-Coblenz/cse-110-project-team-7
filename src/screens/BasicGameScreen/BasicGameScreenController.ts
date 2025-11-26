import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { BasicGameScreenModel } from "./BasicGameScreenModel.ts";
import { BasicGameScreenView } from "./BasicGameScreenView.ts";
import { spawnEnemy } from '../../utils/enemyFactory.ts';
import type { BasicEnemy } from '../../models/BasicEnemyModel.ts';
import { GlobalPlayer } from "../../GlobalPlayer.ts";

export class BasicGameScreenController extends ScreenController {
    private model: BasicGameScreenModel;
    private view: BasicGameScreenView;
    private screenSwitcher: ScreenSwitcher;
    private isPaused = false;
    private gameTimer: number | null = null;

    constructor(screenSwitcher: ScreenSwitcher) {
        super();
        this.screenSwitcher = screenSwitcher;
        this.model = new BasicGameScreenModel();
        this.view = new BasicGameScreenView(this);

        this.spawnNewEnemy();
        this.loadCurrentEnemy();
        this.view.updateScore(GlobalPlayer.get_score());
        this.startTimer();
    }

    getView(): BasicGameScreenView {
        return this.view;
    }

    private spawnNewEnemy(): void {
        const newEnemy = spawnEnemy("normal", 1, this.model.getEquationMode()) as BasicEnemy;
        this.model.setEnemy(newEnemy);
    }

    loadCurrentEnemy(): void {
        const enemy = this.model.getCurrentEnemy();
        if (enemy) {
            const enemyHealth = this.model.getEnemyHealth();
            const equationOptions = this.model.getEquationOptions();

            this.view.displayEnemyChallenge(enemyHealth, equationOptions);
        }
    }

    async handleAnswer(selected: string): Promise<void> {
        const isCorrect = this.model.checkAnswer(selected);

        if (isCorrect) {
            this.view.showCorrectFeedback();
            this.view.updateMonsterImage('src/assets/monstersln.png');

            this.model.defeatCurrentEnemy();
            this.model.incrementCorrectAnswers();
            this.view.updateProgress(this.model.getCorrectAnswers(), this.model.MAX_LEVELS);
            this.view.updateScore(GlobalPlayer.increase_score(10));

            await this.sleep(2000);

            if (this.model.hasReachedMaxLevel()) {
                this.view.switchToBossScreen();
                this.view.updateScore(GlobalPlayer.increase_score(15))
                return;
            }

            this.model.resetTimer();
            // Controller spawns new enemy using factory
            this.spawnNewEnemy();
            this.view.updateMonsterImage('src/assets/monster.png');
            this.loadCurrentEnemy();

        } else {
            this.view.showWrongFeedback();
            this.view.updateMonsterImage('src/assets/monsteratk.png');

            this.model.decreasePlayerHealth();
            this.view.updateHealthDisplay(this.model.getPlayerHealth());
            this.view.updateScore(GlobalPlayer.decrease_score(5));

            await this.sleep(2000);
            this.view.updateMonsterImage('src/assets/monster.png');

            if (!this.model.isPlayerAlive()) {
                this.view.showGameOver();
                this.stopTimer();
            }
        }
    }

    getPlayerHealth(): number {
        return this.model.getPlayerHealth();
    }

    getMaxHealth(): number {
        return this.model.MAX_HEALTH;
    }

    getCorrectAnswers(): number {
        return this.model.getCorrectAnswers();
    }

    getMaxLevels(): number {
        return this.model.MAX_LEVELS;
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private startTimer(): void {
        this.gameTimer = setInterval(() => {
            const timeRemaining = this.model.tickTimer(); // decrement every tick
            this.view.updateTimer(timeRemaining);

            if (timeRemaining <= 0) {
                this.handleTimeOut();
            }
        }, 1000);
    }

    private stopTimer(): void {
        if (this.gameTimer != null) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
    }

    private handleTimeOut(): void {
        this.model.decreasePlayerHealth();
        this.view.updateHealthDisplay(this.model.getPlayerHealth());
        this.view.updateScore(GlobalPlayer.decrease_score(5));
        this.model.resetTimer();
    }

    togglePaused(): void {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.pauseGame();
        } else {
            this.resumeGame();
        }
    }
     
    private pauseGame(): void {
        this.stopTimer();
        this.view.showPauseOverlay();
        this.view.getChoiceButtons().forEach(btn => btn.listening(false));
    }

    private resumeGame(): void {
        this.startTimer();
        this.view.hidePauseOverlay();
        this.view.getChoiceButtons().forEach(btn => btn.listening(true));
    }
    
}