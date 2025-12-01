import { getRandomSprite } from './spriteUtils';
import { BasicEnemy } from '../models/BasicEnemyModel';
import { BossEnemy } from '../models/BossEnemyModel';

const MAX_HEALTH = 100;
const MIN_HEALTH = 10;

// Random number in range
function randomInt(): number {
  return Math.floor(Math.random() * (MAX_HEALTH - MIN_HEALTH + 1)) + MIN_HEALTH;
}

export function spawnEnemy(
  type: "normal" | "boss" = "normal",
  damage: number = 1
): BasicEnemy | BossEnemy {

  const health = randomInt();

  // Make sprite utils consistent with model expectations
  const { name, spriteSet } = getRandomSprite(type); 
  // ^ We'll update spriteUtils next if needed

  if (type === "boss") {
    const healthBars = [randomInt(), randomInt(), randomInt()];
    return new BossEnemy(healthBars, damage, name, spriteSet);
  }

  return new BasicEnemy(health, damage, name, spriteSet);
}
