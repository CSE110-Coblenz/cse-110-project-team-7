import { BOSS_PHASE_DURATION } from "../../constants";
import { GlobalPlayer } from "../../GlobalPlayer";
/**
 * BossGameScreenModel - Manages game state
 * Game Screen Model essentially only interacts with the global player model-
 * i.e. it creates a layer between MVC of the Boss Screen so that there is a 
 * medium for managing health and score.
 * It also manages time remaining
 */
export class BossGameScreenModel {
    // the actual score is held in the global player model
    private timeRemaining = BOSS_PHASE_DURATION;

    constructor() { }

    //Global Player Score management
    addScore(amount: number) {
        GlobalPlayer.increase_score(amount);
    }

    subtractScore(amount: number) {
        GlobalPlayer.decrease_score(amount);
    }

    getScore(): number {
        return GlobalPlayer.get_score();
    }

    //Global Player health management
    take_damage(num: number): number {
        GlobalPlayer.take_damage(num);
        return GlobalPlayer.get_health();
    }

    get_health(): number {
        return GlobalPlayer.get_health();
    }

    //Timer funcctions. 
    tickTimer(): number {
        // hard stop on 0
        this.timeRemaining = Math.max(0, this.timeRemaining - 1);
        return this.timeRemaining;
    }

    getTime(): number {
        return this.timeRemaining;
    }

    resetTimer(): void {
        this.timeRemaining = BOSS_PHASE_DURATION;
    }


}