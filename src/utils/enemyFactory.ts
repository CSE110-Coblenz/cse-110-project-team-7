import { getRandomSprite } from './spriteUtils';
import { BasicEnemy } from '../models/BasicEnemyModel'
import { BossEnemyModel, type BossPhase } from '../models/BossEnemyModel'
import { generateEquation } from './generateEquation';
const MAX_HEALTH = 100;
const MIN_HEALTH = 10;

// get random number between min_health, max_health
function randomInt(): number {
  return Math.floor(Math.random() * (MAX_HEALTH - MIN_HEALTH + 1)) + MIN_HEALTH;
}

function generateBossPhase(): BossPhase {
  return {
        targetNumber: randomInt(),
        tiles: ['0','1','2','3','4','5','6','7','8','9','-','+','x','/'], // placeholder tiles
        imagePath: `boss_phase_${Math.floor(Math.random() * 3) + 1}.png`
    };
}

function generatePhases(count: number = 3): BossPhase[] {
  return Array.from({ length: count }, () => generateBossPhase());
}

export function spawnEnemy(type: "normal" | "boss" = "normal", damage: number = 1): BasicEnemy | BossEnemyModel{
    const spriteData = getRandomSprite(type);
    if (!spriteData) throw new Error("getRandomSprite() returned undefined!");

    const [name, sprite] = spriteData;

    if (type === "boss") {
        const phases = generatePhases();
        return new BossEnemyModel(phases, sprite);
    }

    const health = randomInt();
    return new BasicEnemy(health, damage, name, sprite);
}

