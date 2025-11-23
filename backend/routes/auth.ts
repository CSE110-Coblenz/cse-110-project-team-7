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

    await User.create({
        username,
        passwordHash: hash,
        towerNumber: 1,
    });

    res.json({ message: "Signup successful!" });
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
    });
});

export default router;




