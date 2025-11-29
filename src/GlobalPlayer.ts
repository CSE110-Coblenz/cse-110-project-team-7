import { Player } from "./models/PlayerModel.ts";


export const GlobalPlayer = new Player("user");

let _username:string=""

export function setUsername(username:string):void{
    _username=username
}
export function getUsername():string{
    return _username
}
export function setHighestTowerUnlocked(level:number):void{
    GlobalPlayer.highestTowerUnlocked=level
}

//add code to read globalplayer from DB