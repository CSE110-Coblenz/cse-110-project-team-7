const MAX_HEALTH = 3;

export class Player {
    health: number;
    name: string;
    score: number;
    highestTowerUnlocked: number;

    // add more player attributes as needed
    constructor(name: any = null){
        this.health = MAX_HEALTH;
        this.name = name;
        this.score = 0;
        this.highestTowerUnlocked = 1;
    }

    get_health(): number {
        return this.health;
    }

    reset_health(): void{
        this.health = MAX_HEALTH;
    }

    is_alive(): boolean{
        return this.health > 0;
    }
    
    take_damage(damage: number): void{
        this.health -= damage;
    }

    increase_score(change: number): number{
        console.log("pkayer model increase score");
        this.score += change;

        return this.score;
    }

    decrease_score(change: number): number {
        this.score -= change;
        if (this.score < 0) this.score = 0;

        return this.score;
    }

    get_score(): number { 
        return this.score;
    }
    
    get_highest_tower(): number {
        return this.highestTowerUnlocked;
    }

    unlock_next_tower(): void {
        this.highestTowerUnlocked += 1;
    }

    is_tower_unlocked(tower: number): boolean {
        return this.highestTowerUnlocked >= tower;
    }

}