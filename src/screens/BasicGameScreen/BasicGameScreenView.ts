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
	private monster?: Konva.Image;
	
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

		Konva.Image.fromURL('src/assets/monster.png', (monsterNode) => {
			this.monster = monsterNode;
			monsterNode.setAttrs({
				x: STAGE_WIDTH / 2.5,
				y: STAGE_HEIGHT * 0.05,
				scaleX: 0.5,
				scaleY: 0.5,
				cornerRadius: 20
			});
			this.group.add(monsterNode)
			this.group.getLayer()?.draw();
		});
		
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

		this.group.add(this.questionText);

		this.loadQuestion(currentQuestionIndex);
    }

	loadQuestion(index: number){
		const question = questions[index];
		this.updateEquationText(`${question.answer}`, 20, 20);

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

	async handleAnswer(selected: string){
		const question = questions[currentQuestionIndex];

		if (selected === question.equation){
			console.log("correct");
			this.updateMonsterImage('src/assets/monstersln.png')
			await this.sleep(2000);
			this.updateMonsterImage('src/assets/monster.png')
			currentQuestionIndex++;

			if (currentQuestionIndex < questions.length) {
				this.loadQuestion(currentQuestionIndex);
			} else {
				console.log("finished")
			}
		} else {
			console.log("wrong")
			this.updateMonsterImage('src/assets/monsteratk.png')
			await this.sleep(2000);
			this.updateMonsterImage('src/assets/monster.png')
		}
	}
	
	updateEquationText(text: string, x?: number, y?: number){
		this.questionText.text(text);

		if (x !== undefined) this.questionText.x(x);
		if (y !== undefined) this.questionText.y(y);

		this.group.getLayer()?.draw();
	}

	updateMonsterImage(newUrl: string){
		Konva.Image.fromURL(newUrl, (newMonster) => {
			newMonster.position(this.monster!.position());
			newMonster.scale(this.monster!.scale());

			this.monster?.destroy();
			this.monster = newMonster;
			this.group.add(newMonster);
			this.group.getLayer()?.draw();
		});
	}

	sleep(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
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
