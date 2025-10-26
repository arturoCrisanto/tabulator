import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: String,
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
});

export default mongoose.model("Category", categorySchema);
