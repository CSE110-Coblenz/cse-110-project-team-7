// Model for the boss enemy. 
// Needs to be managed and called from src/screens/BossGameScreen

export interface BossPhase {
    targetNumber: number;
    tiles: string[];
    imagePath: string;
}

export class BossEnemyModel {
    private phases: BossPhase[];
    private index = 0;

    constructor(phases: BossPhase[]) {
        this.phases = phases;
    }

    getCurrentPhase(): BossPhase {
        return this.phases[this.index];
    }

    isFinalPhase(): boolean {
        return this.index >= this.phases.length - 1;
    }

    nextPhase(): void {
        if (!this.isFinalPhase()) {
            this.index++;
        }
    }

    reset(): void {
        this.index = 0;
    }
}
