import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { BasicGameScreenModel } from "./BasicGameScreenModel.ts";
import { BasicGameScreenView } from "./BasicGameScreenView.ts";
import { Player } from '../../models/PlayerModel.ts'
import { BasicEnemy } from '../../models/BasicEnemyModel.ts'

/**
 * BasicGameScreenController - Coordinates game logic between Model and View
 */
export class BasicGameScreenController extends ScreenController {
    private model: BasicGameScreenModel;
    private view: BasicGameScreenView;
    private screenSwitcher: ScreenSwitcher;
    
    constructor(screenSwitcher: ScreenSwitcher) {
        super();
        this.screenSwitcher = screenSwitcher;
        this.model = new BasicGameScreenModel();
        this.view = new BasicGameScreenView(this);
        
        // Initialize the view with first enemy
        this.loadCurrentEnemy();
    }

    /**
     * Get the view group
     */
    getView(): BasicGameScreenView {
        return this.view;
    }

    /**
     * Load the current enemy and display its health as the question
     */
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

    /**
     * Handle user's answer selection
     */
    async handleAnswer(selected: string): Promise<void> {
        const isCorrect = this.model.checkAnswer(selected);
        const enemy = this.model.getCurrentEnemy();
        if (!enemy) return;
        
        if (isCorrect) {
            // Show correct feedback
            this.view.showCorrectFeedback();
            this.view.updateMonsterImage(enemy.slainSprite);
            
            // Defeat the enemy
            this.model.defeatCurrentEnemy();
            
            // Update progress
            this.model.incrementCorrectAnswers();
            this.view.updateProgress(this.model.getCorrectAnswers(), this.model.MAX_LEVELS);
            
            // Wait for animation
            await this.sleep(2000);
            
            // Check if reached max level (boss fight)
            if (this.model.hasReachedMaxLevel()) {
                this.view.switchToBossScreen();
                return;
            }
            
            // Spawn new enemy and load it
            this.model.spawnNewEnemy();
            this.loadCurrentEnemy();
            
        } else {
            // Show wrong feedback
            this.view.showWrongFeedback();
            this.view.updateMonsterImage(enemy.attackSprite);
            
            // Player takes damage
            this.model.decreasePlayerHealth();
            
            // Update view health
            this.view.updateHealthDisplay(this.model.getPlayerHealth());
            
            // Wait for animation
            await this.sleep(2000);
            this.view.updateMonsterImage(this.getCurrentEnemySprite());
            
            // Check if game over
            if (!this.model.isPlayerAlive()) {
                this.view.showGameOver();
            }
        }
    }

    /**
     * Get current game statistics for view
     */
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

    /**
     * Helper method for delays
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
