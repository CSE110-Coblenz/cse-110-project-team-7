// Stage dimensions
// COMPLETELY ARBITRARY feel free to change
import Konva from "konva";
export const STAGE_WIDTH = window.innerWidth;
export const STAGE_HEIGHT = window.innerHeight;

window.addEventListener("resize", () => {
    const stage = Konva.stages?.[0];
    if (stage) {
        stage.width(window.innerWidth);
        stage.height(window.innerHeight);
        stage.draw();
    }
});
