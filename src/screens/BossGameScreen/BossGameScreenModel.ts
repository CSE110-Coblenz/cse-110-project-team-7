/**
 * GameScreenModel - Manages game state
 */
export class BossGameScreenModel {
	private phases: number = 4;
    private score: number = 0;
    private nums: number[] = [5, 10, 15, 20];

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

    getNums(): number{
        return this.nums[0];
    }


}
