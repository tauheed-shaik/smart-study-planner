import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    points: { type: Number, default: 0 }, // Gamification
    badges: [{ type: String }], // Gamification
    streak: { type: Number, default: 0 }, // Gamification
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
