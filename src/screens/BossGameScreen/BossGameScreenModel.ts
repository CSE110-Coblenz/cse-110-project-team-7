import { BOSS_PHASE_DURATION } from "../../constants"; 
/**
 * GameScreenModel - Manages game state
 */
export class BossGameScreenModel {
    private score = 0;
    private timeRemaining = BOSS_PHASE_DURATION;

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
        this.timeRemaining = BOSS_PHASE_DURATION;
    }


}
