import { getRandomSprite } from './spriteUtils';
import { BasicEnemy } from '../models/BasicEnemyModel'
import { BossEnemy } from '../models/BossEnemyModel'

const MAX_HEALTH = 100;
const MIN_HEALTH = 10;

// get random number between min_health, max_health
function randomInt(): number {
  return Math.floor(Math.random() * (MAX_HEALTH - MIN_HEALTH + 1)) + MIN_HEALTH;
}


export function spawnEnemy(type: "normal" | "boss" = "normal", damage: number = 1): BasicEnemy | BossEnemy{
    const health = randomInt();
    const enemy = getRandomSprite(type);
    const name = enemy![0];
    const sprite = enemy![1];

    if (type === 'boss'){
        let health_bars = [randomInt(), randomInt(), randomInt()]
        return new BossEnemy(health_bars, damage, name, sprite);
    }

    return new BasicEnemy(health, damage, name, sprite);
}

