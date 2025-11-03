import { getRandomSprite } from './spriteUtils';
import { BasicEnemy } from '../models/BasicEnemyModel'

// get random number between 0, 100
function randomInt(): number{
    return Math.floor(Math.random() * 100);
}

export function spawnEnemy(type: "normal" | "boss" = "normal", damage: number = 1): BasicEnemy{
    const health = randomInt();
    const sprite = getRandomSprite(type);

    // Return new boss enemy from boss model
    // if (type === 'boss'){
    //     return new bossenemy
    // }

    return new BasicEnemy(health, damage, sprite);
}

