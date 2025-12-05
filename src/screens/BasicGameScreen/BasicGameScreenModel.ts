import { BasicEnemy } from '../../models/BasicEnemyModel';
import { generateEquationOptions } from "../../utils/generateEquation.ts";
import { evaluate } from "../../utils/equationSolver.ts";
import { GlobalPlayer } from '../../GlobalPlayer.ts';
import { BASE_GAME_DURATION } from "../../constants.ts";

export type EquationMode = "any" | "addition" | "subtraction" | "multiplication" | "division";

export class BasicGameScreenModel {
    level: number;
    tower: number;
    enemy: BasicEnemy | null = null;
    
    private correctAnswers: number = 0;
    private equationMode: EquationMode = "addition";
    private equationOptions: string[] = [];

    private timeRemaining = BASE_GAME_DURATION; // time remaining per question

    readonly MAX_HEALTH = 3;
    readonly MAX_LEVELS = 2;

    constructor(level: number = 0, tower: number = 1) {
        this.level = level;
        this.tower = tower;
        this.setEquationMode(tower);
    }

    increment_level(): void { this.level += 1; }
    reset_level(): void { this.level = 0; }

    // Player health management
    getPlayerHealth(): number { return GlobalPlayer.get_health(); }
    decreasePlayerHealth(): void { GlobalPlayer.take_damage(1); }
    isPlayerAlive(): boolean { return GlobalPlayer.get_health() > 0; }

    // Progress tracking
    getCorrectAnswers(): number { return this.correctAnswers; }
    incrementCorrectAnswers(): void { this.correctAnswers++; }
    hasReachedMaxLevel(): boolean { return this.correctAnswers >= this.MAX_LEVELS; }

    // Enemy management
    getCurrentEnemy(): BasicEnemy | null { return this.enemy; }
    getEnemyHealth(): number { return this.enemy ? this.enemy.health : 0; }
    setEnemy(enemy: BasicEnemy): void {
        this.enemy = enemy;
        this.equationOptions = generateEquationOptions(enemy.health, this.equationMode);
    }

    getEquationOptions(): string[] { return this.equationOptions; }
    getEquationMode(): EquationMode { return this.equationMode; }

    checkAnswer(selected: string): boolean {
        if (!this.enemy) return false;
        try {
            return evaluate(selected) === this.enemy.health;
        } catch {
            return false;
        }
    }

    defeatCurrentEnemy(): void { this.enemy?.take_damage(); }

    setEquationMode(tower: number): void {
        switch (tower) {
            case 1: this.equationMode = "addition"; break;
            case 2: this.equationMode = "subtraction"; break;
            case 3: this.equationMode = "multiplication"; break;
            case 4: this.equationMode = "division"; break;
            default: this.equationMode = "any"; break;
        }
    }

    setTower(tower: number): void {
        this.tower = tower;
        this.setEquationMode(tower);
        this.correctAnswers = 0;
        this.reset_level();
    }

    // Timer methods
    tickTimer(): number { return this.timeRemaining--; }
    getTime(): number { return this.timeRemaining; }
    resetTimer(): void { this.timeRemaining = BASE_GAME_DURATION; }
}
