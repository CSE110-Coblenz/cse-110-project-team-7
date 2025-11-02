import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import type { KonvaNodeEvent } from "konva/lib/types";
import { Stage } from "konva/lib/Stage";

/**
 * GameScreenView - Renders the game UI using Konva
 */

const questions = [
	{ equation: "9+10", answer: "19", options: ["9+10", "2+8", "3+10", "12+9"] },
	{ equation: "2+4", answer: "6", options: ["2+5", "3+1", "2+4", "2+2"] },
	{ equation: "3*3", answer: "9", options: ["3*2", "2*2", "1*2", "3*3"] },
  ];

let currentQuestionIndex = 0;
  
export class BasicGameScreenView implements View {
	private group: Konva.Group;
	private questionText: Konva.Text;
	private choiceButtons: Konva.Group[] = [];
	

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
			text: "",
			fontSize: 36,
			fontFamily: "Calibri",
			fill: "black",
			align: "center",
		});

		this.group.add(this.questionText)

		this.loadQuestion(currentQuestionIndex);
    }

	loadQuestion(index: number){
		const question = questions[index];
		this.updateEquationText(`Answer: ${question.answer}`);

		this.choiceButtons.forEach(btn => btn.destroy());
		this.choiceButtons = [];

		const buttonWidth = STAGE_WIDTH * 0.4;
		const buttonHeight = 60;
		const startY = STAGE_HEIGHT * 0.35;
		const spacing = 20;

		question.options.forEach((choice, i) => {
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
				rect.fill("#bbb");
				this.group.getLayer()?.batchDraw();
			});
			buttonGroup.on("mouseout", () => {
				rect.fill("#ddd");
				this.group.getLayer()?.batchDraw();
			});

			buttonGroup.on("click", () => {
				this.handleAnswer(choice);
			});

			buttonGroup.add(rect);
			buttonGroup.add(text);
			this.group.add(buttonGroup);
			this.choiceButtons.push(buttonGroup);
		});

		this.group.getLayer()?.draw();
	}

	handleAnswer(selected: string){
		const question = questions[currentQuestionIndex];

		if (selected === question.equation){
			console.log("correct");
			currentQuestionIndex++;

			if (currentQuestionIndex < questions.length) {
				this.loadQuestion(currentQuestionIndex);
			} else {
				console.log("finished")
			}
		} else {
			console.log("wrong")
		}
	}
	
	updateEquationText(text: string){
		const eqNode = this.group.findOne((node: Konva.Node) => node.getClassName() === "Text");
		if (eqNode) {
			(eqNode as Konva.Text).text(text);
			this.group.getLayer()?.draw();
		}
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
