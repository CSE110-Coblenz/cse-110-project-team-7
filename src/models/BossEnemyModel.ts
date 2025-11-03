export class BossEnemy {
    health_bars: number[];
    damage: number;
    name: string;
    sprite: string;
    current_health: number = 0;

    constructor(health_bars: number[], damage: number = 1, name: any, sprite: string){
        this.sprite = sprite;
        this.health_bars = health_bars;
        this.damage = damage;
        this.name = name;
    }

    get_current_health(): number{
        return this.health_bars[this.current_health];
    }

    take_damage(): void{
        this.current_health += 1;
    } 

    is_alive(): boolean{
        return this.current_health < this.health_bars.length;
    }
    
}