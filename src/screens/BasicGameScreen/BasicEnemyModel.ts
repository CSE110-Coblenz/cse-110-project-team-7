export class BasicEnemy {
    health: number;
    damage: number;
    name: string;
    // default damage is 1, can modify for other types of enemies
    constructor(health: number, damage: number = 1, name: any){
        this.health = health;
        this.damage = damage;
        this.name = name;
    }

    // enemy only takes damage if player answers exact health
    // player answer should be handled in controller
    take_damage(): void{
        this.health = 0;
    }

    is_alive(): boolean{
        return this.health > 0;
    }
    
}