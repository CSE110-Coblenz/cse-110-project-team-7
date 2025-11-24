import { BasicEnemy } from '../../models/BasicEnemyModel'
import { generateEquationOptions } from "../../utils/generateEquation.ts";
import { evaluate } from "../../utils/equationSolver.ts";

/**
 * GameScreenModel - Manages game state
 */
const BASE_LEVEL = 0;
const BASE_TOWER = 1;
const LEVELS_PER_TOWER = 10;

export type EquationMode = "any" | "addition" | "subtraction" | "multiplication" | "division";

export class BasicGameScreenModel {
    level: number;
    tower: number;
    enemy: BasicEnemy | null = null;
    
    // Game state
    private playerHealth: number = 3;
    private correctAnswers: number = 0;
    private equationMode: EquationMode = "addition";
    private equationOptions: string[] = [];
    
    readonly MAX_HEALTH = 3;
    readonly MAX_LEVELS = 20;

    constructor(level: number = BASE_LEVEL, tower: number = BASE_TOWER) {
        this.level = level;
        this.tower = tower;
        this.spawnNewEnemy();
    }

    // Level management
    increment_level(): void {
        this.level += 1;
    }

    increment_tower(): void {
        this.tower += 1;
        this.level = 0;
        switch (this.tower) {
            case 1:
                this.equationMode = "addition";
                break;
            case 2:
                this.equationMode = "subtraction";
                break;
            case 3:
                this.equationMode = "multiplication";
                break;
            case 4:
                this.equationMode = "division";
                break;
            default:
                this.equationMode = "any";
                break;
        }
    }

    reset_level(): void {
        this.level = BASE_LEVEL;
    }

    // Player health management
    getPlayerHealth(): number {
        return this.playerHealth;
    }

    decreasePlayerHealth(): void {
        if (this.playerHealth > 0) {
            this.playerHealth--;
        }
    }

    isPlayerAlive(): boolean {
        return this.playerHealth > 0;
    }

    // Progress tracking
    getCorrectAnswers(): number {
        return this.correctAnswers;
    }

    incrementCorrectAnswers(): void {
        this.correctAnswers++;
    }

    hasReachedMaxLevel(): boolean {
        return this.correctAnswers >= this.MAX_LEVELS;
    }

    // Enemy management
    getCurrentEnemy(): BasicEnemy | null {
        return this.enemy;
    }

    getEnemyHealth(): number {
        return this.enemy ? this.enemy.health : 0;
    }

    spawnNewEnemy(): void {
        // Generate a random target health (the "question")
        const targetHealth = Math.floor(Math.random() * 30);
        
        // Create the enemy with this health
        this.enemy = new BasicEnemy(
            targetHealth,
            1,
            `Monster ${this.correctAnswers + 1}`,
            'src/assets/monster.png'
        );

        // Generate equation options based on enemy health
        this.equationOptions = generateEquationOptions(targetHealth, this.equationMode);
    }

    getEquationOptions(): string[] {
        return this.equationOptions;
    }

    // Answer validation - check if selected equation equals enemy health
    checkAnswer(selected: string): boolean {
        if (!this.enemy) return false;
        
        try {
            const result = evaluate(selected);
            return result === this.enemy.health;
        } catch {
            return false;
        }
    }

    defeatCurrentEnemy(): void {
        if (this.enemy) {
            this.enemy.take_damage();
        }
    }

    setEquationMode(mode: EquationMode): void {
        this.equationMode = mode;
    }
}