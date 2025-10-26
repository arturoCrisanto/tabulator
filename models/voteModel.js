import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  judge: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" },
  score: Number,
});

export default mongoose.model("Vote", voteSchema);
