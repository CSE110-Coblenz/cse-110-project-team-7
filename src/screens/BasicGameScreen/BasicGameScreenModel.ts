import { BasicEnemy } from '../../models/BasicEnemyModel'
/**
 * GameScreenModel - Manages game state
 */
const BASE_LEVEL = 0;

// 1, 2, 3, 4 for each tower
const BASE_TOWER = 1;
const LEVELS_PER_TOWER = 10;

export class BasicGameScreenModel {
	level: number;
    tower: number;
    enemy: BasicEnemy | null = null;

    constructor(level: number = BASE_LEVEL, tower: number = BASE_TOWER, enemy: BasicEnemy){
        this.level = level;
        this.tower = tower;
        this.enemy = enemy;
    }  

    increment_level(): void {
        this.level += 1;
    }

    increment_tower(): void{
        this.tower += 1;
        this.level = 0;
    }

    reset_level(): void{
        this.level = BASE_LEVEL;
    }
}
