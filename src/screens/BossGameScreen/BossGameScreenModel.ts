import { BOSS_PHASE_DURATION } from "../../constants";
import { GlobalPlayer } from "../../GlobalPlayer"; 
/**
 * GameScreenModel - Manages game state
 */
export class BossGameScreenModel {
    // the actual score is held in the global player model
    private timeRemaining = BOSS_PHASE_DURATION;

    constructor() {}

    addScore(amount: number) {
        GlobalPlayer.increase_score(amount);
    }

    subtractScore(amount: number) {
        GlobalPlayer.decrease_score(amount);
    }

    getScore(): number {
        return GlobalPlayer.get_score();
    }

    tickTimer(): number {
        return this.timeRemaining--;
    }

    getTime(): number {
        return this.timeRemaining;
    }

    resetTimer(): void {
        this.timeRemaining = BOSS_PHASE_DURATION;
    }


}
