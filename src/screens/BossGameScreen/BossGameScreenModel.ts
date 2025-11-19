/**
 * GameScreenModel - Manages game state
 */
export class BossGameScreenModel {
    private score = 0;
    private timeRemaining = 60;

    constructor() {}

    addScore(amount: number) {
        this.score += amount;
    }

    getScore(): number {
        return this.score;
    }

    tickTimer(): number {
        return this.timeRemaining--;
    }

    getTime(): number {
        return this.timeRemaining;
    }

    reset(): void {
        this.score = 0;
        this.timeRemaining = 120;
    }


}
