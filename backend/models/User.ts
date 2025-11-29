import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },

  highestTowerUnlocked:{type:Number,default:1},
  score:{type:Number,default:0},

},{
  timestamps:true
}
);

export default mongoose.model("User", UserSchema);
