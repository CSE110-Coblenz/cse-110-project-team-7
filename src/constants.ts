// Stage dimensions
// COMPLETELY ARBITRARY feel free to change
import Konva from "konva";

export const STAGE_WIDTH = typeof window !== 'undefined' ? window.innerWidth : 1000;
export const STAGE_HEIGHT = typeof window !== 'undefined' ? window.innerHeight : 800;
export const GAME_DURATION = 300;

if (typeof window !== 'undefined') {
    window.addEventListener("resize", () => {
        const stage = Konva.stages?.[0];
        if (stage) {
            stage.width(window.innerWidth);
            stage.height(window.innerHeight);
            stage.draw();
        }
    });
}