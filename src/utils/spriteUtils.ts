const normal_sprites = {
    'slime': 'sprite', 
    'skeleton': 'sprite', 
    'goblin': 'sprite', 
    'bat': 'sprite'}

const boss_sprites = {
    'ogre': 'sprite',
    'witch': 'sprite',
    'giant': 'sprite', 
    'werewolf': 'sprite'}


function getRandomKey<T extends object>(dict: T): keyof T {
  const keys = Object.keys(dict) as (keyof T)[];
  const randomIndex = Math.floor(Math.random() * keys.length);
  return keys[randomIndex];
}

export function getRandomSprite(type: "normal" | "boss" = "normal"): [string, string] | undefined{
    if (type == 'normal'){
        const key = getRandomKey(normal_sprites);
        return [key, normal_sprites[key]];
    } else if (type == 'boss'){
        const key = getRandomKey(boss_sprites);
        return [key, boss_sprites[key]];
    }
}