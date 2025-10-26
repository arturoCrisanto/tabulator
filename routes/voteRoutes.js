import express from "express";
import {
  submitVote,
  getRanking,
  getVotesByJudge,
  updateVote,
  deleteVote,
} from "../controllers/voteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Submit a vote (requires authentication)
router.post("/", protect, submitVote);

// Get ranking for an event
router.get("/ranking/:eventId", getRanking);

// Get votes by judge
router.get("/judge/:judgeId", protect, getVotesByJudge);

// Update a vote (requires authentication)
router.put("/:voteId", protect, updateVote);

// Delete a vote (requires authentication)
router.delete("/:voteId", protect, deleteVote);

export default router;
