/**
 * GameScreenModel - Manages game state
 */
export class BossGameScreenModel {
	private phases: number = 4;
    private score: number = 0;

    decrementPhases(): void {
        this.phases--;
    }

    getPhases(): number {
        return this.phases;
    }

    reset(): void {
        this.phases = 4;
		this.score = 0;
	}

    getScore(): number {
        return this.score;
    }


}
