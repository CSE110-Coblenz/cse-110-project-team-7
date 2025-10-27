export class BasicEnemy {
    health: number;
    damage: number;

    // default damage is 1, can modify for other types of enemies
    constructor(health: number, damage: number = 1){
        this.health = health;
        this.damage = damage;
    }

    // enemy only takes damage if player answers exact health
    take_damage(answer: number): void{
        if (answer == this.health){
            this.health = 0;
        }
    }

    is_alive(): boolean{
        return this.health > 0;
    }
    
}