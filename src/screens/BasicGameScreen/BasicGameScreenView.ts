import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

/**
 * GameScreenView - Renders the game UI using Konva
 */
export class BasicGameScreenView implements View {
	private group: Konva.Group;
	private questionText: Konva.Text;
	private choiceButtons: Konva.Group[] = [];
	private currentQuestion: string = "49";
	private currentChoices: string[] = ["4* 7", "4 * 12", "7 * 7", "9 * 2"];

    constructor() {
		this.group = new Konva.Group({ visible: false });
		

		const bg = new Konva.Rect({
			x:0,
			y:0,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
			fill: "#f0f0f0",
		});
		this.group.add(bg);

		this.questionText = new Konva.Text({
			x: 0,
			y: STAGE_WIDTH * 0.15,
			width: STAGE_WIDTH,
			text: this.currentQuestion,
			fontSize: 36,
			fontFamily: "Calibri",
			fill: "black",
			align: "center",
		});
		this.group.add(this.questionText)

		const buttonWidth = STAGE_WIDTH * 0.4;
		const buttonHeight = 60;
		const startY = STAGE_HEIGHT * 0.35;
		const spacing = 20;

		this.currentChoices.forEach((choice, i) => {
			const buttonGroup = new Konva.Group({
				x: STAGE_WIDTH / 2 - buttonWidth / 2,
				y: startY + i * (buttonHeight + spacing),
			});
			const rect = new Konva.Rect({
				width: buttonWidth,
				height: buttonHeight,
				fill: '#ddd',
				stroke: '#555',
				strokeWidth: 4,
				cornerRadius: 10,
				shadowColor: "black",
				shadowBlur: 5,
				shadowOpacity: 0.2,
			});

			const text = new Konva.Text({
				width: buttonWidth,
				height: buttonHeight,
				text: choice,
				fontSize: 24,
				fontFamily: "Calibri",
				fill: "black",
				align: "center",
				verticalAlign: "middle",
			});

			buttonGroup.on("mouseover", () => {
				rect.fill('#bbb');
				this.group.getLayer()?.batchDraw();
			});
			buttonGroup.on("mouseout", () => {
				rect.fill('#ddd');
				this.group.getLayer()?.batchDraw();
			});

			buttonGroup.on("click", () => {
				console.log(`Choice: ${choice}`);
				// controller logic
			});

			buttonGroup.add(rect);
			buttonGroup.add(text);
			this.group.add(buttonGroup);
			this.choiceButtons.push(buttonGroup);
		});
    }

	updateQuestion(question: string, choices: string[]): void {
		this.currentQuestion = question;
		this.currentChoices = choices;

		this.questionText.text(question);
		this.choiceButtons.forEach((group, i) => {
			const textNode = group.findOne<Konva.Text>("Text");
			textNode?.text(choices[i] ?? "");
		});
		this.group.getLayer()?.draw();
	}

	show(): void {
		this.group.visible(true);
		this.group.getLayer()?.draw();
	}

	hide(): void {
		this.group.visible(false);
		this.group.getLayer()?.draw();
	}

	getGroup(): Konva.Group {
		return this.group;
	}
}
