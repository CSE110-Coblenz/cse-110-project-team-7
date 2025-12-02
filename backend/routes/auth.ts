import express,{Request,Response} from "express"; //for endpoints
import bcrypt from "bcrypt"; //for hashing
import User from "../models/User"

const router=express.Router();

router.post("/signup", async (req:Request, res:Response): Promise<void>=> {
    const { username, password } = req.body;

    const existing = await User.findOne({ username });
    if (existing) {
        res.status(400).json({ error: "Username already exists" });
        return;
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser=await User.create({
        username,
        passwordHash: hash,
        highestTowerUnlocked: 1,
    });

    res.json({ message: "Signup successful!",
    username:newUser.username,
    highestTowerUnlocked:newUser.highestTowerUnlocked,
    });
    
});

router.post("/login", async (req: Request, res: Response) :Promise<void>=> {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user){

    res.status(400).json({ error: "Invalid username" });
    return;
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
        res.status(400).json({ error: "Invalid password" });
        return;
    }

    res.json({
        message: "Login success",
        username: user.username,
        highestTowerUnlocked:user.highestTowerUnlocked
    });
});
router.get('progress/:username',async(req:Request,res:Response):Promise<void>=>{
    const{username}=req.params;
    const user=await User.findOne({username})
    if(!user){
        res.status(404).json({error:'User not found'})
        return
    }
    res.json({
        username:user.username,
        highestTowerUnlocked:user.highestTowerUnlocked
    })
})
router.post('/progress/update',async(req:Request,res:Response):Promise<void>=>{
    const{username,towerCompleted}=req.body
    if(!username || !towerCompleted){
        res.status(400).json({error:'Missing required fields'})
        return
    }
    const user=await User.findOne({username})
    if(!user){
        res.status(404).json({error:'User not found'})
        return
    }
    if(towerCompleted==user.highestTowerUnlocked && towerCompleted<5){
        user.highestTowerUnlocked=towerCompleted+1
    }
    await user.save();

    res.json({
        message:'Progress updated',
        highestTowerUnlocked:user.highestTowerUnlocked
    })
})

export default router;




