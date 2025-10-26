import Vote from "../models/voteModel.js";

export const submitVote = async (req, res) => {
  try {
    const { event, category, judge, candidate, score } = req.body;

    // Validate required fields
    if (!event || !category || !judge || !candidate || score === undefined) {
      return res.status(400).json({
        message:
          "All fields are required: event, category, judge, candidate, score",
      });
    }

    // Validate score range (assuming 1-10 scale)
    if (score < 1 || score > 10) {
      return res.status(400).json({
        message: "Score must be between 1 and 10",
      });
    }

    // Check if judge has already voted for this candidate in this category
    const existingVote = await Vote.findOne({
      event,
      category,
      judge,
      candidate,
    });

    if (existingVote) {
      return res.status(409).json({
        message: "Judge has already voted for this candidate in this category",
      });
    }

    const vote = await Vote.create({
      event,
      category,
      judge,
      candidate,
      score,
    });

    // Populate the created vote for better response
    const populatedVote = await Vote.findById(vote._id)
      .populate("event", "name")
      .populate("category", "name")
      .populate("judge", "name")
      .populate("candidate", "name");

    res.status(201).json({
      message: "Vote submitted successfully",
      vote: populatedVote,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error submitting vote",
      error: error.message,
    });
  }
};

export const getRanking = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { categoryId } = req.query; // Optional category filter

    if (!eventId) {
      return res.status(400).json({
        message: "Event ID is required",
      });
    }

    // Build query object
    const query = { event: eventId };
    if (categoryId) {
      query.category = categoryId;
    }

    const votes = await Vote.find(query)
      .populate("candidate", "name")
      .populate("category", "name")
      .populate("judge", "name");

    if (!votes.length) {
      return res.status(404).json({
        message: "No votes found for this event",
      });
    }

    // Calculate scores by candidate
    const candidateScores = {};
    const candidateInfo = {};

    votes.forEach((vote) => {
      const candidateId = vote.candidate._id.toString();

      if (!candidateScores[candidateId]) {
        candidateScores[candidateId] = {
          totalScore: 0,
          voteCount: 0,
          scores: [],
        };
        candidateInfo[candidateId] = {
          name: vote.candidate.name,
          _id: vote.candidate._id,
        };
      }

      candidateScores[candidateId].totalScore += vote.score;
      candidateScores[candidateId].voteCount += 1;
      candidateScores[candidateId].scores.push(vote.score);
    });

    // Create ranking with additional statistics
    const ranking = Object.entries(candidateScores)
      .map(([candidateId, scoreData]) => ({
        candidate: candidateInfo[candidateId],
        totalScore: scoreData.totalScore,
        averageScore: scoreData.totalScore / scoreData.voteCount,
        voteCount: scoreData.voteCount,
        scores: scoreData.scores,
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((item, index) => ({
        rank: index + 1,
        ...item,
      }));

    res.json({
      eventId,
      categoryId: categoryId || "all",
      totalVotes: votes.length,
      ranking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving ranking",
      error: error.message,
    });
  }
};

// Get votes by judge
export const getVotesByJudge = async (req, res) => {
  try {
    const { judgeId } = req.params;
    const { eventId } = req.query;

    if (!judgeId) {
      return res.status(400).json({
        message: "Judge ID is required",
      });
    }

    const query = { judge: judgeId };
    if (eventId) {
      query.event = eventId;
    }

    const votes = await Vote.find(query)
      .populate("event", "name")
      .populate("category", "name")
      .populate("candidate", "name")
      .sort({ createdAt: -1 });

    res.json({
      judgeId,
      eventId: eventId || "all",
      totalVotes: votes.length,
      votes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving judge votes",
      error: error.message,
    });
  }
};

// Update a vote (if allowed)
export const updateVote = async (req, res) => {
  try {
    const { voteId } = req.params;
    const { score } = req.body;

    if (!voteId) {
      return res.status(400).json({
        message: "Vote ID is required",
      });
    }

    if (score === undefined || score < 1 || score > 10) {
      return res.status(400).json({
        message: "Valid score (1-10) is required",
      });
    }

    const vote = await Vote.findById(voteId);
    if (!vote) {
      return res.status(404).json({
        message: "Vote not found",
      });
    }

    vote.score = score;
    await vote.save();

    const updatedVote = await Vote.findById(voteId)
      .populate("event", "name")
      .populate("category", "name")
      .populate("judge", "name")
      .populate("candidate", "name");

    res.json({
      message: "Vote updated successfully",
      vote: updatedVote,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating vote",
      error: error.message,
    });
  }
};

// Delete a vote
export const deleteVote = async (req, res) => {
  try {
    const { voteId } = req.params;

    if (!voteId) {
      return res.status(400).json({
        message: "Vote ID is required",
      });
    }

    const vote = await Vote.findById(voteId);
    if (!vote) {
      return res.status(404).json({
        message: "Vote not found",
      });
    }

    await Vote.findByIdAndDelete(voteId);

    res.json({
      message: "Vote deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting vote",
      error: error.message,
    });
  }
};
