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

    getView(): BasicGameScreenView { return this.view; }

    // --- Enemy management ---
    private spawnNewEnemy(): void {
        const newEnemy = spawnEnemy("normal", 1, this.model.getEquationMode()) as BasicEnemy;
        this.model.setEnemy(newEnemy);
    }

    loadCurrentEnemy(): void {
        const enemy = this.model.getCurrentEnemy();
        if (!enemy) return;

        this.view.displayEnemyChallenge(this.model.getEnemyHealth(), this.model.getEquationOptions());
        this.view.updateMonsterImage(this.getCurrentEnemySprite());
    }

    getCurrentEnemySprite(): string {
        const enemy = this.model.getCurrentEnemy();
        return enemy ? enemy.idleSprite : 'src/assets/monster.png';
    }

    // --- Answer handling ---
    async handleAnswer(selected: string): Promise<void> {
        const isCorrect = this.model.checkAnswer(selected);
        const enemy = this.model.getCurrentEnemy();
        if (!enemy) return;

        if (isCorrect) {
            this.view.showCorrectFeedback();
            this.view.updateMonsterImage(enemy.slainSprite);

            this.model.defeatCurrentEnemy();
            this.model.incrementCorrectAnswers();
            this.view.updateProgress(this.model.getCorrectAnswers(), this.model.MAX_LEVELS);
            this.view.updateScore(GlobalPlayer.increase_score(10));

            await this.sleep(2000);

            if (this.model.hasReachedMaxLevel()) {
                this.screenSwitcher.switchToScreen({type: 'boss_game'});
                this.view.updateScore(GlobalPlayer.increase_score(15));
                return;
            }

            this.spawnNewEnemy();
            this.loadCurrentEnemy();
        } else {
            this.view.showWrongFeedback();
            this.view.updateMonsterImage(enemy.attackSprite);

            this.model.decreasePlayerHealth();
            this.view.updateHealthDisplay(this.model.getPlayerHealth());
            this.view.updateScore(GlobalPlayer.decrease_score(5));

            await this.sleep(2000);
            this.view.updateMonsterImage(this.getCurrentEnemySprite());

            if (!this.model.isPlayerAlive()) {
                this.view.showGameOver();
                this.stopTimer();
            }
        }
    }

    // --- Tower management ---
    setTower(tower: number): void {
        this.model.setTower(tower);
        this.view.updateProgress(0, this.model.MAX_LEVELS);

        GlobalPlayer.reset_health();
        this.view.updateHealthDisplay(GlobalPlayer.get_health());

        this.spawnNewEnemy();
        this.loadCurrentEnemy();
        this.isPaused = false;
        this.stopTimer();
        this.model.resetTimer();
        this.startTimer();
    }

    getTower(): number { return this.model.tower; }
    getPlayerHealth(): number { return this.model.getPlayerHealth(); }
    getMaxHealth(): number { return this.model.MAX_HEALTH; }
    getCorrectAnswers(): number { return this.model.getCorrectAnswers(); }
    getMaxLevels(): number { return this.model.MAX_LEVELS; }

    // --- Timer ---
    private sleep(ms: number): Promise<void> { return new Promise(resolve => setTimeout(resolve, ms)); }

    private startTimer(): void {
        if (this.gameTimer !== null) return;
        this.gameTimer = setInterval(() => {
            const timeRemaining = this.model.tickTimer();
            this.view.updateTimer(timeRemaining);

            if (timeRemaining <= 0) this.handleTimeOut();
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

    // --- Pause/Resume ---
    togglePaused(): void {
        this.isPaused = !this.isPaused;
        if (this.isPaused) this.pauseGame();
        else this.resumeGame();
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

    // --- Quit / return ---
    public returnToTowerSelect(): void {
        this.stopTimer();
        const quitButton = this.view.getQuitButton();
        if (quitButton) quitButton.visible(false);
        this.view.hidePauseOverlay();
        GlobalPlayer.reset_health();
        this.model.resetTimer();
        this.model.reset_level();
        this.isPaused = false;
        this.screenSwitcher.switchToScreen({ type: "tower_select" });
    }
}
