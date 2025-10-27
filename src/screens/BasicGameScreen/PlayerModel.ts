const MAX_HEALTH = 5;

export class Player {
    health: number;
    name: string;

    // add more player attributes as needed
    constructor(name: any = null){
        this.health = MAX_HEALTH;
        this.name = name;
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
    

}