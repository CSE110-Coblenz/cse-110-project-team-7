export interface SpriteSet {
    idle: string;
    attack: string;
    damage: string;
    slain: string;
}

// You already have this list
export const ENEMY_SPRITE_SETS: SpriteSet[] = [
    {
        idle: 'src/assets/monsters/mask.png',
        attack: 'src/assets/monsters/maskatk.png',
        damage: 'src/assets/monsters/maskdmg.png',
        slain: 'src/assets/monsters/maskdmg.png'
    },
    {
        idle: 'src/assets/monster.png',
        attack: 'src/assets/monsteratk.png',
        damage: 'src/assets/monsterhurt.png',
        slain: 'src/assets/monstersln.png'
    },
    {
        idle: 'src/assets/monsters/redrobot.png',
        attack: 'src/assets/monsters/redrobotatk.png',
        damage: 'src/assets/monsters/redrobotdmg.png',
        slain: 'src/assets/monsters/redrobotdmg.png'
    },
    {
        idle: 'src/assets/monsters/slimeblue.png',
        attack: 'src/assets/monsters/slimeblueatk.png',
        damage: 'src/assets/monsters/slimebluedmg.png',
        slain: 'src/assets/monsters/slimebluedmg.png'
    }
];

const normalNames = ["slime", "skeleton", "goblin", "bat"];
const bossNames = ["ogre", "witch", "giant", "werewolf"];

function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function getRandomSprite(type: "normal" | "boss" = "normal") {
    const name = type === "normal" ? pick(normalNames) : pick(bossNames);
    const spriteSet = pick(ENEMY_SPRITE_SETS);

    return { name, spriteSet };
}
