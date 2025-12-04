import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import { BossGameScreenView } from "../BossGameScreen/BossGameScreenView.ts";
import type { BasicGameScreenController } from "./BasicGameScreenController.ts";

let bossScreen: BossGameScreenView | null = null;

const DESIRED_MONSTER_SIZE = 20;
export class BasicGameScreenView implements View {
    private group: Konva.Group;
    private enemyHealthText!: Konva.Text;
    private levelText!: Konva.Text;
    private choiceButtons: Konva.Group[] = [];
    private monster?: Konva.Image;
    private hearts: Konva.Image[] = [];
    private controller: BasicGameScreenController;
    private currentSelectedRect?: Konva.Rect;
    
    constructor(controller: BasicGameScreenController) {
        this.controller = controller;
        this.group = new Konva.Group({ visible: false });
        this.initializeUI();
    }

    private initializeUI(): void {
        const maxHealth = this.controller.getMaxHealth();
        this.hearts = new Array(maxHealth);
        const bg = new Konva.Rect({
            x: 0,
            y: 0,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            fill: "#f0f0f0",
        });
        this.group.add(bg);
        

        Konva.Image.fromURL(this.controller.getCurrentEnemySprite(), (monsterNode) => {
            this.monster = monsterNode;
        
            const img = monsterNode.image();
            const DESIRED_MONSTER_SIZE = 150;
        
            const applyScale = () => {
                const scale = DESIRED_MONSTER_SIZE / img.width;
                monsterNode.setAttrs({
                    x: STAGE_WIDTH / 2.15,
                    y: 100,
                    scaleX: scale,
                    scaleY: scale,
                    image: img,
                });
        
                this.group.add(monsterNode);
                this.group.getLayer()?.draw();
            };
        
            if (img.width > 0) applyScale();
            else img.onload = applyScale;
        });
        
        
        
        for (let i = 0; i < this.controller.getMaxHealth(); i++) {
            Konva.Image.fromURL('src/assets/heart.png', (heart) => {
                heart.setAttrs({
                    x: 20 + i * 40,
                    y: 20,
                    scaleX: 0.15,
                    scaleY: 0.15,
					image: heart.image()
                });
                this.group.add(heart);
                this.hearts[i] = heart;
                this.group.getLayer()?.draw();
            });
        }

        this.createHelpButton();

        this.levelText = new Konva.Text({
            x: STAGE_WIDTH - 180,
            y: STAGE_HEIGHT - 50,
            text: `Progress: ${this.controller.getCorrectAnswers()}/${this.controller.getMaxLevels()}`,
            fontSize: 28,
            fontFamily: "Calibri",
            fill: "black",
        });
        this.group.add(this.levelText);

        this.enemyHealthText = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: 0,
            text: "",
            fontSize: 36,
            fontFamily: "Calibri",
            fill: "black",
        });
        this.group.add(this.enemyHealthText);
    }

    private createHelpButton(): void {
        const helpGroup = new Konva.Group({
            x: STAGE_WIDTH - 70,
            y: 20,
            cursor: "pointer",
        });

        const helpBox = new Konva.Rect({
            x: 0,
            y: 0,
            width: 50,
            height: 50,
            fill: "lightblue",
            stroke: "blue",
            strokeWidth: 2,
            cornerRadius: 5,
        });

        const helpText = new Konva.Text({
            x: 0,
            y: 0,
            text: "?",
            fontSize: 36,
            fontFamily: "Calibri",
            fill: "blue",
            width: 50,
            height: 50,
            align: "center",
            verticalAlign: "middle",
            listening: false,
        });

        helpGroup.on("mouseover", () => {
            helpBox.fill("darkblue");
            this.group.getLayer()?.batchDraw();
        });

        helpGroup.on("mouseout", () => {
            helpBox.fill("lightblue");
            this.group.getLayer()?.batchDraw();
        });

        helpGroup.on("click", () => {
            this.showHelpPopup();
        });

        helpGroup.add(helpBox);
        helpGroup.add(helpText);
        this.group.add(helpGroup);
    }

    showHelpPopup(): void {
        const overlay = new Konva.Rect({
            x: 0,
            y: 0,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            fill: "black",
            opacity: 0.6,
        });

        const popup = new Konva.Group({
            x: STAGE_WIDTH / 2 - 200,
            y: STAGE_HEIGHT / 2 - 150,
        });

        const box = new Konva.Rect({
            width: 400,
            height: 300,
            fill: "white",
            cornerRadius: 10,
            shadowColor: "black",
            shadowBlur: 10,
            shadowOpacity: 0.5,
        });

        const text = new Konva.Text({
            text: "How to play:\n\n1. Each monster has a number (their health) displayed \n2. Select the equation that equals the monster's health\n3. Be Careful! If you select the wrong answer, you'll lose a life. Three strikes and you're out...\n4. Keep defeating monsters to climb the tower.",
            width: 380,
            padding: 10,
            fontSize: 20,
            fontFamily: "Calibri",
            fill: "black",
            align: "left",
        });

        const closeBtn = new Konva.Text({
            x: 360,
            y: 10,
            text: "X",
            fontSize: 24,
            fontFamily: "Calibri",
            fill: "red",
            cursor: "pointer",
        });

        closeBtn.on("click", () => {
            popup.destroy();
            overlay.destroy();
            this.group.getLayer()?.draw();
        });

        popup.add(box);
        popup.add(text);
        popup.add(closeBtn);

        this.group.add(overlay);
        this.group.add(popup);

        overlay.moveToTop();
        popup.moveToTop();
        this.group.getLayer()?.draw();
    }

    displayEnemyChallenge(enemyHealth: number, equationOptions: string[]): void {
        this.enemyHealthText.text(enemyHealth.toString());
        this.choiceButtons.forEach(btn => btn.destroy());
        this.choiceButtons = [];

        const buttonWidth = STAGE_WIDTH * 0.4;
        const buttonHeight = 60;
        const startY = STAGE_HEIGHT * 0.35;
        const spacing = 20;

        equationOptions.forEach((equation, i) => {
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
                text: equation,
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
                // Notify controller about answer selection
                this.currentSelectedRect = rect;
                this.controller.handleAnswer(equation);
            });

            buttonGroup.add(rect);
            buttonGroup.add(text);
            this.group.add(buttonGroup);
            this.choiceButtons.push(buttonGroup);
        });

        this.group.getLayer()?.draw();
    }

    showCorrectFeedback(): void {
        if (this.currentSelectedRect) {
            this.currentSelectedRect.fill("#58b85a");
            this.group.getLayer()?.draw();
        }
    }

    showWrongFeedback(): void {
        if (this.currentSelectedRect) {
            this.currentSelectedRect.fill("#bd2c19");
            this.group.getLayer()?.draw();
        }
    }

    updateHealthDisplay(currentHealth: number): void {
        const maxHealth = this.controller.getMaxHealth();
        for (let i = 0; i < maxHealth; i++) {
            this.hearts[i].visible(i < currentHealth);
        }
        this.group.getLayer()?.draw();
    }

    updateProgress(correctAnswers: number, maxLevels: number): void {
        this.levelText.text(`Progress: ${correctAnswers}/${maxLevels}`);
        this.group.getLayer()?.draw();
    }

    /**
     * Update monster image
     */
    updateMonsterImage(newUrl: string): void {
        Konva.Image.fromURL(newUrl, (newMonster) => {
            const img = newMonster.image();
            const DESIRED_MONSTER_SIZE = 150;
    
            const applyScale = () => {
                const scale = DESIRED_MONSTER_SIZE / img.width;
    
                newMonster.position(this.monster!.position());
                newMonster.scale({ x: scale, y: scale });
    
                this.monster?.destroy();
                this.monster = newMonster;
                this.group.add(newMonster);
                this.group.getLayer()?.draw();
            };
    
            if (img.width > 0) applyScale();
            else img.onload = applyScale;
        });
    }
    

    /**
     * Show game over screen
     */
    showGameOver(): void {
        const text = new Konva.Text({
            x: 0,
            y: STAGE_HEIGHT / 2 - 50,
            width: STAGE_WIDTH,
            align: "center",
            text: "GAME OVER",
            fontSize: 60,
            fontFamily: "Calibri",
            fill: "red"
        });
        this.group.add(text);
        this.group.getLayer()?.draw();
        
        // Disable all buttons
        this.choiceButtons.forEach(btn => btn.off("click"));
    }

    /**
     * Switch to boss screen
     */
    switchToBossScreen(): void {
        console.log("Switching to boss screen...");
        this.hide();

        if (!bossScreen) {
            bossScreen = new BossGameScreenView();
        }
        bossScreen.show();
    }

    /**
     * Show the view
     */
    show(): void {
        this.group.visible(true);
        this.group.getLayer()?.draw();
    }

    /**
     * Hide the view
     */
    hide(): void {
        this.group.visible(false);
        this.group.getLayer()?.draw();
    }

    /**
     * Get the Konva group
     */
    getGroup(): Konva.Group {
        return this.group;
    }
}