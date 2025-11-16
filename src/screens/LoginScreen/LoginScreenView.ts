import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

/**
 * GameScreenView - Renders the game UI using Konva
 */
export class LoginScreenView implements View {
	private group: Konva.Group;
	private usernameInput: HTMLInputElement
	private passwordInput:HTMLInputElement

	private onLoginEntered:(username:string,password:string)=>void;
	private onSignUpEntered:(username:string,password:string)=>void;
    constructor(
		onLoginEntered: (username: string, password:string) => void, 
		onSignUpEntered:(username:string,password:string)=>void) {
		this.group = new Konva.Group({ visible: false });
		this.onLoginEntered=onLoginEntered
		this.onSignUpEntered=onSignUpEntered
		/*
	 	* Title text
		*/
		const title = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: STAGE_HEIGHT / 4,
			text: "Math Game Login Screen", // Temporary title
			fontSize: 36,
			fontFamily: "Arial",
			fill: "black",
			align: "center",
		});

		// HTML input element for username
		this.usernameInput = document.createElement("input");
		this.usernameInput.type = "text";
		this.usernameInput.placeholder = "Enter Username";
		this.usernameInput.style.position = "absolute";
		this.usernameInput.style.top = `${STAGE_HEIGHT / 2 - 40}px`;
		this.usernameInput.style.left = `${STAGE_WIDTH / 2 - 100}px`;
		this.usernameInput.style.width = "200px";
		this.usernameInput.style.fontSize = "16px";
		document.body.appendChild(this.usernameInput);

		this.passwordInput = document.createElement("input");
		this.passwordInput.type = "text";
		this.passwordInput.placeholder = "Enter Password";
		this.passwordInput.style.position = "absolute";
		this.passwordInput.style.top = `${STAGE_HEIGHT / 2 - 10}px`;
		this.passwordInput.style.left = `${STAGE_WIDTH / 2 - 100}px`;
		this.passwordInput.style.width = "200px";
		this.passwordInput.style.fontSize = "16px";
		document.body.appendChild(this.passwordInput);

		const loginButton=document.createElement("button")
		loginButton.innerText="Login";
		loginButton.style.position="absolute";
		loginButton.style.top=`${STAGE_HEIGHT/2+35}px`
		loginButton.style.left=`${STAGE_WIDTH/2-100}px`
		loginButton.style.width="90px"
		loginButton.onclick=()=>
			this.onLoginEntered(this.usernameInput.value,this.passwordInput.value)
		document.body.appendChild(loginButton)

		const signUpButton=document.createElement("button")
		signUpButton.innerText="Sign Up";
		signUpButton.style.position="absolute";
		signUpButton.style.top=`${STAGE_HEIGHT/2+100}px`
		signUpButton.style.left=`${STAGE_WIDTH/2+30}px`
		signUpButton.style.width="90px"
		signUpButton.onclick=()=>
			this.onSignUpEntered(this.usernameInput.value,this.passwordInput.value)
		document.body.appendChild(signUpButton)

		// Handle Enter key to submit username
		this.passwordInput.addEventListener("keydown", (e: KeyboardEvent) => {
			if (e.key == "Enter") {
				onLoginEntered(this.usernameInput.value,this.passwordInput.value);
				
			}
		});
		
		// Center the title
		title.offsetX(title.width() / 2);
		this.group.add(title);

    }

	
	/**
	 * Show the screen
	 */
	show(): void {
		this.group.visible(true);
		const layer = this.group.getLayer();
		if (layer) {
			layer.draw();
		}
	}

	/**
	 * Hide the screen
	 */
	hide(): void {
		this.group.visible(false);
		this.group.getLayer()?.draw();
	}

	getGroup(): Konva.Group {
		return this.group;
	}


}
