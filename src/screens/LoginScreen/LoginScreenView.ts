import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

export class LoginScreenView implements View {
	private group: Konva.Group;

	private usernameText: Konva.Text;
	private passwordText: Konva.Text;

	private cursor: Konva.Text;
	private cursorVisible: boolean = true;
	private cursorIntervalId: number | null = null;

	private activeField: "username" | "password" | null = null;

	private onLogin: (u: string, p: string) => void;
	private onSignUp: (u: string, p: string) => void;

	constructor(
		onLogin: (username: string, password: string) => void,
		onSignUp: (username: string, password: string) => void
	) {
		this.group = new Konva.Group({ visible: false });
		this.onLogin = onLogin;
		this.onSignUp = onSignUp;

		/*
		 * Title
		 */
		const title = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: 80,
			text: "Math Game Login",
			fontSize: 36,
			fontFamily: "Arial",
			fill: "black"
		});
		title.offsetX(title.width() / 2);
		this.group.add(title);

		/*
		 * Username Input Box
		 */
		const usernameBox = new Konva.Rect({
			x: STAGE_WIDTH / 2 - 150,
			y: 200,
			width: 300,
			height: 45,
			fill: "#ffffff",
			stroke: "#000000",
			cornerRadius: 6
		});
		this.group.add(usernameBox);

		this.usernameText = new Konva.Text({
			x: STAGE_WIDTH / 2 - 140,
			y: 212,
			text: "",
			fontSize: 20,
			fontFamily: "Arial",
			fill: "black"
		});
		this.group.add(this.usernameText);

		usernameBox.on("click", () => {
			this.activeField = "username";
			this.updateCursorPosition();
		});

		/*
		 * Change cursor on hover for username box & change hover color
		*/

		usernameBox.on("mouseover", () => {
			document.body.style.cursor = "text";
		});
		usernameBox.on("mouseout", () => {
			document.body.style.cursor = "default";
		});	
		usernameBox.on("mouseover", () => {
			usernameBox.fill("#e0e0e0");
			this.group.getLayer()?.draw();
		});
		usernameBox.on("mouseout", () => {
			usernameBox.fill("#ffffff");
			this.group.getLayer()?.draw();
		});	

		/*
		 * Password Input Box
		 */
		const passwordBox = new Konva.Rect({
			x: STAGE_WIDTH / 2 - 150,
			y: 260,
			width: 300,
			height: 45,
			fill: "#ffffff",
			stroke: "#000000",
			cornerRadius: 6
		});
		this.group.add(passwordBox);

		this.passwordText = new Konva.Text({
			x: STAGE_WIDTH / 2 - 140,
			y: 272,
			text: "",
			fontSize: 20,
			fontFamily: "Arial",
			fill: "black"
		});
		this.group.add(this.passwordText);

		passwordBox.on("click", () => {
			this.activeField = "password";
			this.updateCursorPosition();
		});

		/*
		* Deactivates blinking cursor when clicking outside input boxes
		*/
		this.group.on("click", (e) => {
			const clicked = e.target;
			const isUsername = clicked === usernameBox || clicked === this.usernameText;
			const isPassword = clicked === passwordBox || clicked === this.passwordText;
			
			if (!isUsername && !isPassword) {
				this.activeField = null;
				this.cursor.visible(false);
				this.group.getLayer()?.draw();
			}
		});

		/*
		 * Change cursor on hover for password box
		*/
		
		passwordBox.on("mouseover", () => {
			document.body.style.cursor = "text";
		});
		passwordBox.on("mouseout", () => {
			document.body.style.cursor = "default";
		});
		passwordBox.on("mouseover", () => {
			passwordBox.fill("#e0e0e0");
			this.group.getLayer()?.draw();
		});
		passwordBox.on("mouseout", () => {
			passwordBox.fill("#ffffff");
			this.group.getLayer()?.draw();
		});	

		/*
		 * Login Button
		 */
		const loginButton = new Konva.Rect({
			x: STAGE_WIDTH / 2 - 150,
			y: 330,
			width: 130,
			height: 45,
			fill: "#4caf50",
			cornerRadius: 6
		});
		const loginText = new Konva.Text({
			x: STAGE_WIDTH / 2 - 115,
			y: 343,
			text: "Login",
			fontSize: 22,
			fill: "white"
		});

		loginButton.on("click", () => {
			this.onLogin(this.usernameText.text(), this.passwordText.text());
		});
		loginText.on("click",()=>{
			this.onLogin(this.usernameText.text(),this.passwordText.text())
		})

		this.group.add(loginButton);
		this.group.add(loginText);


		/*
		 * Cursor styling for login button
		*/
		loginButton.on("mouseover", () => {
			document.body.style.cursor = "pointer";
		});
		loginButton.on("mouseout", () => {
			document.body.style.cursor = "default";
		});
		loginButton.on("mouseover", () => {
			loginButton.fill("#45a049");
			this.group.getLayer()?.draw();
		});
		loginButton.on("mouseout", () => {
			loginButton.fill("#4caf50");
			this.group.getLayer()?.draw();
		});	
		loginText.on("mouseover", () => {
			document.body.style.cursor = "pointer";
		});
		loginText.on("mouseout", () => {
			document.body.style.cursor = "default";
		});

		/*
		 * Cursor (blinking line)
		 */
		this.cursor = new Konva.Text({
			x: 0,
			y: 0,
			text: "|",
			fontSize: 20,
			fontFamily: "Arial",
			fill: "black",
			visible: false
		});
		this.group.add(this.cursor);

		/*
		 * Sign Up Button
		 */
		const signUpButton = new Konva.Rect({
			x: STAGE_WIDTH / 2 + 20,
			y: 330,
			width: 130,
			height: 45,
			fill: "#2196f3",
			cornerRadius: 6
		});
		const signUpText = new Konva.Text({
			x: STAGE_WIDTH / 2 + 50,
			y: 343,
			text: "Sign Up",
			fontSize: 22,
			fill: "white"
		});

		signUpButton.on("click", () => {
			this.onSignUp(this.usernameText.text(), this.passwordText.text());
		});
		signUpText.on("click",()=>{
			this.onSignUp(this.usernameText.text(),this.passwordText.text());
		})

		this.group.add(signUpButton);
		this.group.add(signUpText);

		/*
		 * Cursor styling for sing up button
		*/
		signUpButton.on("mouseover", () => {
			document.body.style.cursor = "pointer";
		});
		signUpButton.on("mouseout", () => {
			document.body.style.cursor = "default";
		});
		signUpButton.on("mouseover", () => {
			signUpButton.fill("#1976d2");
			this.group.getLayer()?.draw();
		});
		signUpButton.on("mouseout", () => {
			signUpButton.fill("#2196f3");
			this.group.getLayer()?.draw();
		});
		signUpText.on("mouseover", () => {
			document.body.style.cursor = "pointer";
		});
		signUpText.on("mouseout", () => {
			document.body.style.cursor = "default";
		});	

		/*
		 * Keyboard Input Handler
		 */
		window.addEventListener("keydown", (e) => {
			if (!this.group.visible()) return;
			if (this.activeField === null) return;

			if (e.key === "Backspace") {
				if (this.activeField === "username") {
					this.usernameText.text(this.usernameText.text().slice(0, -1));
				} else {
					this.passwordText.text(this.passwordText.text().slice(0, -1));
				}
			} else if (e.key === "Enter") {
				this.onLogin(this.usernameText.text(), this.passwordText.text());
			} else if (e.key.length === 1) {
				if (this.activeField === "username") {
					this.usernameText.text(this.usernameText.text() + e.key);
				} else {
					this.passwordText.text(this.passwordText.text() + "*");
				}
			}

			this.updateCursorPosition();
			this.group.getLayer()?.draw();
		});

		/*
		 * Cursor blinking logic
		 */
		this.cursorIntervalId = window.setInterval(() => {
			this.cursorVisible = !this.cursorVisible;
			this.cursor.visible(this.cursorVisible);
			this.group.getLayer()?.draw();
		}, 500);
	}

	/*
	 * Update cursor position based on active input
	 */
	private updateCursorPosition(): void {
		let targetText: Konva.Text | null = null;
		let yOffset = 0;

		if (this.activeField === "username") {
			targetText = this.usernameText;
			yOffset = 212;
		} else if (this.activeField === "password") {
			targetText = this.passwordText;
			yOffset = 272;
		}

		if (!targetText) {
			this.cursor.visible(false);
			return;
		}

		this.cursor.visible(true);
		this.cursor.x(targetText.x() + targetText.width() + 2);
		this.cursor.y(yOffset);
	}

	show(): void {
		this.group.visible(true);
		this.group.getLayer()?.draw();
	}

	hide(): void {
		this.group.visible(false);
		this.cursor.visible(false);
		this.group.getLayer()?.draw();
	}

	getGroup(): Konva.Group {
		return this.group;
	}
}
