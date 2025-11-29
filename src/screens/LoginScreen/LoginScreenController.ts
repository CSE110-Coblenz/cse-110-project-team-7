import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { LoginScreenModel } from "./LoginScreenModel.ts";
import { LoginScreenView } from "./LoginScreenView.ts";
import {setUsername,setHighestTowerUnlocked} from '../../GlobalPlayer.ts'

/**
 * BaiscGameScreenController - Coordinates game logic between Model and View
 */
export class LoginScreenController extends ScreenController {
	private model: LoginScreenModel;
	private view: LoginScreenView;
	private screenSwitcher: ScreenSwitcher;
	
    constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;

	// Initialize Model and View
	// Initialize Model and View
		this.model = new LoginScreenModel();
		this.view = new LoginScreenView(
			async (username: string, password:string) => {
			this.model.username = username;
			this.model.password=password;
			console.log("Username entered:", this.model.username); // For testing purposes
			if(!username.trim()||!password.trim()){
				console.error("Username or Password cannot be empty");
				return;
			}
			try{
			const response=await fetch("http://localhost:3000/login",{
				method:"POST",
				headers:{"Content-Type":"application/json"},
				body:JSON.stringify({username,password})
			});
			const data=await response.json();
			if(!response.ok){
				console.error("Login failed:",data.error);
				return;
			}
			console.log("Login Success",data)
			setUsername(data.username)
			setHighestTowerUnlocked(data.highestTowerUnlocked)
			this.screenSwitcher.switchToScreen({type:"tower_select"});
		}
		catch(error){
			console.log("Network error during login",error)
		}
			},
			async (username:string,password:string) =>{
				this.model.username=username;
				this.model.password=password;

				if(!username.trim() || !password.trim()){
					console.error("Username or password cannot be empty");
					return;
				}

			

			const response=await fetch('http://localhost:3000/signup',{
				method:"POST",
				headers:{"Content-Type":"application/json"},
				body:JSON.stringify({username,password})
			});

			const data=await response.json();
			if(!response.ok){
				console.error("SignUp failed:",data.error);
				return;
			}
			console.log("SignUp Success:",data)
			setUsername(data.username)
			setHighestTowerUnlocked(data.highestTowerUnlocked)
			this.screenSwitcher.switchToScreen({type:"tower_select"});
		
   	 	}
	);
}
	/**
	 * Get the view group
	 */
	getView(): LoginScreenView {
		return this.view;
	}
	
}
