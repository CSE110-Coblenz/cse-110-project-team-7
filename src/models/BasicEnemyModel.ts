export class BasicEnemy {
    health: number;
    damage: number;
    name: string;

    idleSprite: string;
    attackSprite: string;
    damageSprite: string;
    slainSprite: string;

    constructor(
        health: number,
        damage: number = 1,
        name: string,
        sprites: {
            idle: string;
            attack: string;
            damage: string;
            slain: string;
        }
    ) {
        this.health = health;
        this.damage = damage;
        this.name = name;

        this.idleSprite = sprites.idle;
        this.attackSprite = sprites.attack;
        this.damageSprite = sprites.damage;
        this.slainSprite = sprites.slain;
    }

    take_damage(): void {
        this.health = 0;
    }

    is_alive(): boolean {
        return this.health > 0;
    }
}