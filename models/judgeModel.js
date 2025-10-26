import mongoose from "mongoose";

const judgeSchema = new mongoose.Schema(
  {
    // Link to a User document (one-to-one per event)
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // The event this judge is assigned to
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    // Categories this judge will score (optional - could be all categories)
    assignedCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    ],

    // Active flag in case a judge is deactivated for an event
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Prevent the same user being added multiple times to the same event
judgeSchema.index({ user: 1, event: 1 }, { unique: true });

export default mongoose.model("Judge", judgeSchema);
