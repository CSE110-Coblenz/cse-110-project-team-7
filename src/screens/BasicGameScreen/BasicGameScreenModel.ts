import { BasicEnemy } from '../../models/BasicEnemyModel'
import { generateEquationOptions } from "../../utils/generateEquation.ts";
import { evaluate } from "../../utils/equationSolver.ts";

export type EquationMode = "any" | "addition" | "subtraction" | "multiplication" | "division";

export class BasicGameScreenModel {
    level: number;
    tower: number;
    enemy: BasicEnemy | null = null;
    
    private playerHealth: number = 3;
    private correctAnswers: number = 0;
    private equationMode: EquationMode = "subtraction";
    private equationOptions: string[] = [];
    
    readonly MAX_HEALTH = 3;
    readonly MAX_LEVELS = 20;

    constructor(level: number = 0, tower: number = 1) {
        this.level = level;
        this.tower = tower;
    }

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
        this.level = 0;
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

    getCurrentEnemy(): BasicEnemy | null {
        return this.enemy;
    }

    getEnemyHealth(): number {
        return this.enemy ? this.enemy.health : 0;
    }

    setEnemy(enemy: BasicEnemy): void {
        this.enemy = enemy;
        this.equationOptions = generateEquationOptions(enemy.health, this.equationMode);
    }

    getEquationOptions(): string[] {
        return this.equationOptions;
    }

    getEquationMode(): EquationMode {
        return this.equationMode;
    }

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