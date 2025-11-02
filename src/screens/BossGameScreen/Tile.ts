import Konva from "konva";

export class Tile {
    private group: Konva.Group;
    private rect: Konva.Rect;
    private text: Konva.Text;

    constructor(
        char: string,
        x: number,
        y: number,
        size = 100,
        fill = "#8B5A2B", // brown
        stroke = "black",
        strokeWidth = 3
    ) {
        this.group = new Konva.Group({
            x,
            y,
            draggable: true,
        });

        this.rect = new Konva.Rect({
            width: size,
            height: size,
            fill,
            stroke,
            strokeWidth,
            cornerRadius: 6,
        });

        this.text = new Konva.Text({
            text: char,
            fontSize: size * 0.6,
            fontStyle: "bold",
            fontFamily: "Arial",
            fill: "black",
            width: size,
            height: size,
            align: "center",
            verticalAlign: "middle",
        });

        this.group.add(this.rect);
        this.group.add(this.text);

        // Optional behavior
        this.group.on("mouseenter", () => {
            const stage = this.group.getStage();
            if (stage) stage.container().style.cursor = "grab";
        });

        this.group.on("mouseleave", () => {
            const stage = this.group.getStage();
            if (stage) stage.container().style.cursor = "default";
        });

    }

    getPosition(): { x: number; y: number } {
        return { x: this.group.x(), y: this.group.y() };
    }

    getNode(): Konva.Group {
        return this.group;
    }

    addToLayer(layer: Konva.Layer) {
        layer.add(this.group);
    }

    getLabel(): string{
        return this.text.text();
    }


}
