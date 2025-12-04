import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import { BossGameScreenView } from "../BossGameScreen/BossGameScreenView.ts";
import type { BasicGameScreenController } from "./BasicGameScreenController.ts";

let bossScreen: BossGameScreenView | null = null;
const DESIRED_MONSTER_SIZE = 150;

export class BasicGameScreenView implements View {
    private group: Konva.Group;
    private enemyHealthText!: Konva.Text;
    private levelText!: Konva.Text;
    private choiceButtons: Konva.Group[] = [];
    private monster?: Konva.Image;
    private hearts: Konva.Image[] = [];
    private controller: BasicGameScreenController;
    private currentSelectedRect?: Konva.Rect;
    private scoreText?: Konva.Text;
    private timerText?: Konva.Text;
    private pauseOverlay?: Konva.Rect;
    private pauseCloseBtn?: Konva.Text;
    private quitBtn?: Konva.Rect | Konva.Text | Konva.Group;

    constructor(controller: BasicGameScreenController) {
        this.controller = controller;
        this.group = new Konva.Group({ visible: false });
        this.initializeUI();
    }

    private initializeUI(): void {
        const maxHealth = this.controller.getMaxHealth();
        this.hearts = new Array(maxHealth);

        this.createCobblestoneWall();
        this.createStoneFloor();

        this.createLantern(100, 150);
        this.createLantern(STAGE_WIDTH - 100, 150);

        // Monster placeholder (use proper scaling on load)
        Konva.Image.fromURL(this.controller.getCurrentEnemySprite(), (monsterNode) => {
            this.monster = monsterNode;
            const img = monsterNode.image();

            const applyScale = () => {
                const scale = DESIRED_MONSTER_SIZE / img.width;
                const position = { x: STAGE_WIDTH / 2.15, y: 100 };
                monsterNode.position(position);
                monsterNode.scale({ x: scale, y: scale });
                this.group.add(monsterNode);
                this.group.getLayer()?.draw();
            };

            if (img.width > 0) applyScale();
            else img.onload = applyScale;
        });

        // Hearts
        for (let i = 0; i < maxHealth; i++) {
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

        // Level/progress text
        this.levelText = new Konva.Text({
            x: STAGE_WIDTH - 180,
            y: STAGE_HEIGHT - 50,
            text: `Progress: ${this.controller.getCorrectAnswers()}/${this.controller.getMaxLevels()}`,
            fontSize: 28,
            fontFamily: "Calibri",
            fill: "black",
        });
        this.group.add(this.levelText);

        // Enemy health text
        this.enemyHealthText = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: 0,
            text: "",
            fontSize: 36,
            fontFamily: "Calibri",
            fill: "black",
        });
        this.group.add(this.enemyHealthText);

        // Score text
        this.scoreText = new Konva.Text({
            x: 20,
            y: 100,
            text: "Score: 0",
            fontSize: 36,
            fontFamily: "Calibri",
            fill: "black",
        });
        this.group.add(this.scoreText);

        // Timer text
        this.timerText = new Konva.Text({
            x: 20,
            y: 150,
            text: "Time: 0",
            fontSize: 36,
            fontFamily: "Calibri",
            fill: "black",
        });
        this.group.add(this.timerText);

        

        // Pause button
        const pauseButton = new Konva.Text({
            x: STAGE_WIDTH - 70,
            y: 100,
            text: "II",
            fontSize: 36,
            fontFamily: "Calibri",
            fill: "white",
            shadowColor: "black",
            shadowBlur: 2,
            cursor: "pointer",
        });
        pauseButton.name("pauseButton");
        pauseButton.on("click", () => {
            pauseButton.visible(false);
            this.controller.togglePaused();
        });
        this.group.add(pauseButton);

        // Add help button
        this.createHelpButton();
    }

    private createCobblestoneWall(): void {
        const width = STAGE_WIDTH || 800;
        const height = STAGE_HEIGHT || 600;

        // Dark background for the wall
        const wallBg = new Konva.Rect({
            x: 0,
            y: 0,
            width: width,
            height: height,
            fill: "#34495e" // Dark blue-grey
        });
        this.group.add(wallBg);

        // Bricks
        const rows = 20;
        const cols = 15;
        const brickWidth = width / cols;
        const brickHeight = height / rows;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c <= cols; c++) {
                // Offset every other row
                const xOffset = (r % 2 === 0) ? 0 : -brickWidth / 2;
                
                // Random shade for texture
                const shade = Math.random() > 0.5 ? "#7f8c8d" : "#95a5a6";

                const brick = new Konva.Rect({
                    x: c * brickWidth + xOffset,
                    y: r * brickHeight,
                    width: brickWidth - 2, // Gap for mortar
                    height: brickHeight - 2,
                    fill: shade,
                    cornerRadius: 2,
                    opacity: 0.8
                });
                this.group.add(brick);
            }
        }
    }
    private createStoneFloor(): void {
        const width = STAGE_WIDTH || 800;
        const height = STAGE_HEIGHT || 600;
        const floorHeight = 100;

        const floor = new Konva.Rect({
            x: 0,
            y: height - floorHeight,
            width: width,
            height: floorHeight,
            fill: "#2c3e50",
            stroke: "#1a252f",
            strokeWidth: 5
        });
        this.group.add(floor);
    }

    private createLantern(x: number, y: number): void {
        // Glow effect
        const glow = new Konva.Circle({
            x: x,
            y: y + 20,
            radius: 80,
            fillRadialGradientStartPoint: { x: 0, y: 0 },
            fillRadialGradientStartRadius: 0,
            fillRadialGradientEndPoint: { x: 0, y: 0 },
            fillRadialGradientEndRadius: 80,
            fillRadialGradientColorStops: [0, "rgba(255, 200, 0, 0.4)", 1, "rgba(0,0,0,0)"]
        });
        this.group.add(glow);

        // Hanger/Bracket
        const bracket = new Konva.Line({
            points: [x, y, x, y - 20, x + 10, y - 20],
            stroke: "#2c3e50",
            strokeWidth: 4
        });

        // Lantern body
        const lantern = new Konva.Rect({
            x: x - 15,
            y: y,
            width: 30,
            height: 40,
            fill: "rgba(255, 255, 0, 0.2)",
            stroke: "#2c3e50",
            strokeWidth: 3
        });

        // Flame center
        const flame = new Konva.Circle({
            x: x,
            y: y + 20,
            radius: 8,
            fill: "#e67e22",
            stroke: "#f1c40f",
            strokeWidth: 2
        });

        this.group.add(bracket);
        this.group.add(lantern);
        this.group.add(flame);
    }

    private createHelpButton(): void {
        const helpGroup = new Konva.Group({ x: STAGE_WIDTH - 70, y: 20, cursor: "pointer" });

        const helpBox = new Konva.Rect({
            x: 0, y: 0, width: 50, height: 50,
            fill: "lightblue", stroke: "blue", strokeWidth: 2, cornerRadius: 5
        });

        const helpText = new Konva.Text({
            x: 0, y: 0, width: 50, height: 50,
            text: "?", fontSize: 36, fontFamily: "Calibri",
            fill: "blue", align: "center", verticalAlign: "middle",
            listening: false
        });

        helpGroup.on("mouseover", () => { helpBox.fill("darkblue"); this.group.getLayer()?.batchDraw(); });
        helpGroup.on("mouseout", () => { helpBox.fill("lightblue"); this.group.getLayer()?.batchDraw(); });
        helpGroup.on("click", () => { this.showHelpPopup(); });

        helpGroup.add(helpBox); helpGroup.add(helpText);
        this.group.add(helpGroup);
    }

    private showHelpPopup(): void {
        const overlay = new Konva.Rect({ x: 0, y: 0, width: STAGE_WIDTH, height: STAGE_HEIGHT, fill: "black", opacity: 0.6 });
        const popup = new Konva.Group({ x: STAGE_WIDTH/2 - 200, y: STAGE_HEIGHT/2 - 150 });
        const box = new Konva.Rect({ width: 400, height: 300, fill: "white", cornerRadius: 10, shadowColor: "black", shadowBlur: 10, shadowOpacity: 0.5 });
        const text = new Konva.Text({
            text: "How to play:\n\n1. Each monster has a number (their health) displayed\n2. Select the equation that equals the monster's health\n3. Be Careful! If you select the wrong answer, you'll lose a life. Three strikes and you're out...\n4. Keep defeating monsters to climb the tower.",
            width: 380, padding: 10, fontSize: 20, fontFamily: "Calibri", fill: "black", align: "left"
        });
        const closeBtn = new Konva.Text({ x: 360, y: 10, text: "X", fontSize: 24, fontFamily: "Calibri", fill: "red", cursor: "pointer" });
        closeBtn.on("click", () => { popup.destroy(); overlay.destroy(); this.group.getLayer()?.draw(); });

        popup.add(box); popup.add(text); popup.add(closeBtn);
        this.group.add(overlay); this.group.add(popup);
        overlay.moveToTop(); popup.moveToTop();
        this.group.getLayer()?.draw();
    }
    getChoiceButtons(): Konva.Group[] {
        return this.choiceButtons;
    }

    getQuitButton(): Konva.Rect | Konva.Text | Konva.Group | undefined {
        return this.quitBtn;
    }

    displayEnemyChallenge(enemyHealth: number, equationOptions: string[]): void {
        this.enemyHealthText.text(enemyHealth.toString());
        
        // Remove old buttons
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

            // Hover effects
            buttonGroup.on("mouseover", () => { rect.fill("#bbb"); this.group.getLayer()?.batchDraw(); });
            buttonGroup.on("mouseout", () => { rect.fill("#ddd"); this.group.getLayer()?.batchDraw(); });

            // Click handling
            buttonGroup.on("click", () => {
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

    updateScore(newScore: number): void {
        if (this.scoreText) {
            this.scoreText.text(`Score: ${newScore}`);
            this.group.getLayer()?.draw();
        }
    }

    updateTimer(timeRemaining: number): void {
        if (this.timerText) {
            this.timerText.text(`Time: ${timeRemaining}`);
            this.group.getLayer()?.draw();
        }
    }

    updateMonsterImage(newUrl: string): void {
        Konva.Image.fromURL(newUrl, (newMonster) => {
            const img = newMonster.image();
            const applyScale = () => {
                const scale = DESIRED_MONSTER_SIZE / img.width;
                const position = this.monster ? this.monster.position() : { x: STAGE_WIDTH / 2.15, y: 100 };
                newMonster.position(position);
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

        // Disable all choice buttons
        this.choiceButtons.forEach(btn => btn.off("click"));
    }

    switchToBossScreen(): void {
        console.log("Switching to boss screen...");
        this.hide();

        if (!bossScreen) {
            bossScreen = new BossGameScreenView();
        }
        bossScreen.show();
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

    showPauseOverlay(): void {
        if (this.pauseOverlay) return; // Already shown

        const pauseButton = this.group.findOne(".pauseButton");
        if (pauseButton) pauseButton.visible(false);

        this.pauseOverlay = new Konva.Rect({
            x: 0,
            y: 0,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            fill: "black",
            opacity: 0.4,
        });

        this.pauseCloseBtn = new Konva.Text({
            x: STAGE_WIDTH - 60,
            y: 90,
            text: "X",
            fontSize: 40,
            fontFamily: "Calibri",
            fill: "red",
            cursor: "pointer",
        });

        this.pauseCloseBtn.on("click", () => {
            this.controller.togglePaused();
        });

        if (!this.quitBtn) {
            const quitBtn = new Konva.Rect({
                x: STAGE_WIDTH / 2 - 75,
                y: STAGE_HEIGHT / 2 - 25,
                width: 150,
                height: 50,
                fill: "Blue",
                stroke: "DarkBlue",
                strokeWidth: 3,
                cornerRadius: 10,
                cursor: "pointer",
            });
            this.quitBtn = quitBtn;
            quitBtn.on("click", () => {
                this.controller.returnToTowerSelect();
            });
        }

        this.group.add(this.pauseOverlay);
        this.group.add(this.pauseCloseBtn);
        if (this.quitBtn) {
            this.group.add(this.quitBtn);
            this.quitBtn.visible(true);
            this.quitBtn.moveToTop();
        }
        this.group.getLayer()?.draw();
    }

    hidePauseOverlay(): void {
        this.pauseOverlay?.destroy();
        this.pauseCloseBtn?.destroy();
        this.pauseOverlay = undefined;
        this.pauseCloseBtn = undefined;

        const pauseButton = this.group.findOne(".pauseButton");
        if (pauseButton) pauseButton.visible(true);

        if (this.quitBtn) this.quitBtn.visible(false);

        this.group.getLayer()?.draw();
    }
}
