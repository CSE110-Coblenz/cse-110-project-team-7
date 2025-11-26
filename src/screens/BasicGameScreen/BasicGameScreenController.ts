import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { BasicGameScreenModel } from "./BasicGameScreenModel.ts";
import { BasicGameScreenView } from "./BasicGameScreenView.ts";
import { spawnEnemy } from '../../utils/enemyFactory.ts';
import type { BasicEnemy } from '../../models/BasicEnemyModel.ts';

export class BasicGameScreenController extends ScreenController {
    private model: BasicGameScreenModel;
    private view: BasicGameScreenView;
    private screenSwitcher: ScreenSwitcher;
    
    constructor(screenSwitcher: ScreenSwitcher) {
        super();
        this.screenSwitcher = screenSwitcher;
        this.model = new BasicGameScreenModel();
        this.view = new BasicGameScreenView(this);
        
        this.spawnNewEnemy();
        this.loadCurrentEnemy();
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
    
            // Update the monster image based on the real enemy sprite
            this.view.updateMonsterImage(enemy.idleSprite);
    
            this.view.displayEnemyChallenge(enemyHealth, equationOptions);
        }
    }
    
    getCurrentEnemySprite(): string {
        const enemy = this.model.getCurrentEnemy();
        return enemy ? enemy.idleSprite : 'src/assets/monster.png';
    }

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
            
            await this.sleep(2000);
            
            if (this.model.hasReachedMaxLevel()) {
                this.view.switchToBossScreen();
                return;
            }
            
            // Spawn new enemy and load it
            this.model.spawnNewEnemy();
            this.loadCurrentEnemy();
            
        } else {
            this.view.showWrongFeedback();
            this.view.updateMonsterImage(enemy.attackSprite);
            
            this.model.decreasePlayerHealth();
            this.view.updateHealthDisplay(this.model.getPlayerHealth());
            
            await this.sleep(2000);
            this.view.updateMonsterImage(this.getCurrentEnemySprite());
            
            if (!this.model.isPlayerAlive()) {
                this.view.showGameOver();
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
}