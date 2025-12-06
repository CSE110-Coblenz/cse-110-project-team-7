import { SPEED_GAME_DURATION } from "../../constants";
import { generateEquation } from "../../utils/generateEquation";
import { evaluate } from "../../utils/equationSolver";

export class SpeedGameScreenModel {
    private timeRemaining: number = SPEED_GAME_DURATION;
    private score: number  = 0;
    private currentQuestion: { a: number; b: number; op: string; answer: number } | null = null;

    constructor() {}

    generateQuestion(): void {
        const operations = ['+', '-', 'x'];
        
        const target = Math.floor(Math.random() * 100) + 1;
        
        const equations = generateEquation(target, 3, 1, operations);
        
        if (equations.length > 0) {
            this.parseEquation(equations[0]);
        } else {
            this.generateSimpleQuestion();
        }
    }

    private parseEquation(equation: string): void {
        let a: number, b: number, op: string, answer: number;
        
        let opIndex = -1;
        let foundOp = '';
        
        for (const operator of ['+', '-', 'x']) {
            const idx = equation.indexOf(operator);
            if (idx > 0) { 
                opIndex = idx;
                foundOp = operator;
                break;
            }
        }
        
        if (opIndex > 0) {
            a = parseInt(equation.substring(0, opIndex));
            b = parseInt(equation.substring(opIndex + 1));
            op = foundOp === 'x' ? '*' : foundOp; 
            answer = evaluate(equation);
            
            this.currentQuestion = { a, b, op, answer };
        } else {
            this.generateSimpleQuestion();
        }
    }

    private generateSimpleQuestion(): void {
        const operations = ['+', '-', '*'];
        const op = operations[Math.floor(Math.random() * operations.length)];
        
        let a: number, b: number, answer: number;
        
        switch (op) {
            case '+':
                a = Math.floor(Math.random() * 50) + 1;
                b = Math.floor(Math.random() * 50) + 1;
                answer = a + b;
                break;
            case '-':
                a = Math.floor(Math.random() * 50) + 10;
                b = Math.floor(Math.random() * a);
                answer = a - b;
                break;
            case '*':
                a = Math.floor(Math.random() * 12) + 1;
                b = Math.floor(Math.random() * 12) + 1;
                answer = a * b;
                break;
            default:
                a = 0;
                b = 1;
                answer = 0;
        }
        
        this.currentQuestion = { a, b, op, answer };
    }

    getCurrentQuestion(): { a: number; b: number; op: string; answer: number } | null {
        return this.currentQuestion;
    }

    checkAnswer(userAnswer: number): boolean {
        if (!this.currentQuestion) return false;
        return userAnswer === this.currentQuestion.answer;
    }

    addScore(points: number): void {
        this.score += points;
    }

    decrementScore(points: number): void {
        this.score = Math.max(0, this.score - points);
    }

    getScore(): number {
        return this.score;
    }

    tickTimer(): number {
        this.timeRemaining = Math.max(0, this.timeRemaining - 1);
        return this.timeRemaining;
    }

    getTimeRemaining(): number {
        return this.timeRemaining;
    }

    reset(): void {
        this.timeRemaining = SPEED_GAME_DURATION;
        this.currentQuestion = null;
    }
}