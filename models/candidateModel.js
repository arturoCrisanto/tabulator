import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
  name: String,
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
});

export default mongoose.model("Candidate", candidateSchema);
