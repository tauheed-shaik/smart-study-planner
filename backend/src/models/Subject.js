import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    color: { type: String, default: "#3b82f6" }, // Default blue
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true }
);

export default mongoose.model("Subject", SubjectSchema);
