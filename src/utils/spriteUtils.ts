const normal_sprites = ['slime', 'skeleton', 'goblin', 'bat']
const boss_sprites = ['ogre', 'witch', 'giant', 'werewolf']

export function getRandomSprite(type: "normal" | "boss" = "normal"){

    if (type == 'normal'){
        const idx = Math.floor(Math.random() * normal_sprites.length);
        return normal_sprites[idx];
    } else if (type == 'boss'){
        const idx = Math.floor(Math.random() * boss_sprites.length);
        return boss_sprites[idx];
    }
}