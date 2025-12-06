import { getRandomSprite } from './spriteUtils';
import { BasicEnemy } from '../models/BasicEnemyModel'
import { BossEnemyModel, type BossPhase } from '../models/BossEnemyModel'
import { generateEquation } from './generateEquation';
import type { EquationMode } from '../screens/BasicGameScreen/BasicGameScreenModel';

const MAX_HEALTH = 30;
const MIN_HEALTH = 10;

function randomInt(): number {
  return Math.floor(Math.random() * (MAX_HEALTH - MIN_HEALTH + 1)) + MIN_HEALTH;
}

function generateBossPhase(operations: string[]): BossPhase {
  let target = randomInt();
  let equations = generateEquation(target, 5, 10, operations);

  if (!equations || equations.length === 0) {
      console.warn("No equations generated, using fallback.");
      equations = [target.toString()];
  }

  const chosenEquation = equations[Math.floor(Math.random() * equations.length)];

  const { spriteSet } = getRandomSprite("boss");

  return {
      targetNumber: target,
      tiles: chosenEquation.split(''),
      imagePath: spriteSet.idle
  };
}


function generatePhases(count: number = 3, operations: string[]): BossPhase[] {
  return Array.from({ length: count }, () => generateBossPhase(operations));
}

function getOperationsFromMode(equationMode: EquationMode): string[] {
    switch (equationMode) {
        case "addition":
            return ["+"];
        case "subtraction":
            return ["-"];
        case "multiplication":
            return ["x"];
        case "division":
            return ["/"];
        case "any":
            return ["+", "-", "x", "/"];
        default:
            return ["+", "-", "x", "/"];
    }
}

export function spawnEnemy(
  type: "normal" | "boss" = "normal",
  damage: number = 1,
  equationMode: EquationMode
): BasicEnemy | BossEnemyModel {
  const { name, spriteSet: sprite } = getRandomSprite(type);
  if (!name || !sprite) throw new Error("getRandomSprite() returned invalid data!");

  if (type === "boss") {
    const ops = getOperationsFromMode(equationMode);
    const phases = generatePhases(3, ops);
    return new BossEnemyModel(phases);
  }

  const health = randomInt();
  return new BasicEnemy(health, damage, name, sprite);
}
