import User from "../models/userModel.js";
import Event from "../models/eventModel.js";
import Category from "../models/categoryModel.js";
import Candidate from "../models/candidateModel.js";
import Vote from "../models/voteModel.js";
import generateToken from "../utils/generateToken.js";

// Admin registration
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email, and password",
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await User.create({ name, email, password, role: "admin" });
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating admin",
      error: error.message,
    });
  }
};

// Admin login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error during login",
      error: error.message,
    });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalVotes = await Vote.countDocuments();
    const totalCandidates = await Candidate.countDocuments();

    const recentEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("categories", "name")
      .populate("judges", "name email");

    res.json({
      stats: {
        totalEvents,
        totalUsers,
        totalVotes,
        totalCandidates,
      },
      recentEvents,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching dashboard stats",
      error: error.message,
    });
  }
};

// Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("categories", "name")
      .populate("judges", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching events",
      error: error.message,
    });
  }
};

// Get single event
export const getEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId)
      .populate("categories", "name")
      .populate("judges", "name email role");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Get candidates for this event
    const candidates = await Candidate.find({ event: eventId });

    // Get vote statistics
    const totalVotes = await Vote.countDocuments({ event: eventId });

    res.json({
      event,
      candidates,
      totalVotes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching event",
      error: error.message,
    });
  }
};

// Admin creates event
export const createEvent = async (req, res) => {
  try {
    const { name, date, description } = req.body;

    if (!name || !date) {
      return res.status(400).json({
        message: "Please provide event name and date",
      });
    }

    const event = await Event.create({
      name,
      date,
      description,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating event",
      error: error.message,
    });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { name, date, description } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.name = name || event.name;
    event.date = date || event.date;
    event.description = description || event.description;

    const updatedEvent = await event.save();

    res.json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating event",
      error: error.message,
    });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Delete associated data
    await Category.deleteMany({ event: eventId });
    await Candidate.deleteMany({ event: eventId });
    await Vote.deleteMany({ event: eventId });
    await Event.findByIdAndDelete(eventId);

    res.json({ message: "Event and associated data deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting event",
      error: error.message,
    });
  }
};

// Get categories for an event
export const getCategories = async (req, res) => {
  try {
    const { eventId } = req.params;

    const categories = await Category.find({ event: eventId });

    res.json({
      eventId,
      count: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

// Admin adds category
export const addCategory = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const category = await Category.create({
      name,
      description,
      event: eventId,
    });

    await Event.findByIdAndUpdate(eventId, {
      $push: { categories: category._id },
    });

    res.status(201).json({
      message: "Category added successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding category",
      error: error.message,
    });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = name || category.name;
    category.description = description || category.description;

    const updatedCategory = await category.save();

    res.json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating category",
      error: error.message,
    });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { eventId, categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Remove category from event
    await Event.findByIdAndUpdate(eventId, {
      $pull: { categories: categoryId },
    });

    // Delete votes associated with this category
    await Vote.deleteMany({ category: categoryId });

    // Delete the category
    await Category.findByIdAndDelete(categoryId);

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting category",
      error: error.message,
    });
  }
};

// Get candidates for an event
export const getCandidates = async (req, res) => {
  try {
    const { eventId } = req.params;

    const candidates = await Candidate.find({ event: eventId });

    res.json({
      eventId,
      count: candidates.length,
      candidates,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching candidates",
      error: error.message,
    });
  }
};

// Admin adds candidate
export const addCandidate = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Candidate name is required" });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const candidate = await Candidate.create({
      name,
      description,
      event: eventId,
    });

    res.status(201).json({
      message: "Candidate added successfully",
      candidate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding candidate",
      error: error.message,
    });
  }
};

// Update candidate
export const updateCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { name, description } = req.body;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    candidate.name = name || candidate.name;
    candidate.description = description || candidate.description;

    const updatedCandidate = await candidate.save();

    res.json({
      message: "Candidate updated successfully",
      candidate: updatedCandidate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating candidate",
      error: error.message,
    });
  }
};

// Delete candidate
export const deleteCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Delete votes associated with this candidate
    await Vote.deleteMany({ candidate: candidateId });

    // Delete the candidate
    await Candidate.findByIdAndDelete(candidateId);

    res.json({ message: "Candidate deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting candidate",
      error: error.message,
    });
  }
};

// Get judges for an event
export const getJudges = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId).populate(
      "judges",
      "name email role"
    );
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({
      eventId,
      count: event.judges.length,
      judges: event.judges,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching judges",
      error: error.message,
    });
  }
};

// Admin adds judge
export const addJudge = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email, and password",
      });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const judge = await User.create({
      name,
      email,
      password,
      role: "judge",
    });

    await Event.findByIdAndUpdate(eventId, {
      $push: { judges: judge._id },
    });

    res.status(201).json({
      message: "Judge added successfully",
      judge: {
        _id: judge._id,
        name: judge.name,
        email: judge.email,
        role: judge.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding judge",
      error: error.message,
    });
  }
};

// Update judge
export const updateJudge = async (req, res) => {
  try {
    const { judgeId } = req.params;
    const { name, email } = req.body;

    const judge = await User.findById(judgeId);
    if (!judge) {
      return res.status(404).json({ message: "Judge not found" });
    }

    if (judge.role !== "judge") {
      return res.status(400).json({ message: "User is not a judge" });
    }

    judge.name = name || judge.name;
    judge.email = email || judge.email;

    const updatedJudge = await judge.save();

    res.json({
      message: "Judge updated successfully",
      judge: {
        _id: updatedJudge._id,
        name: updatedJudge.name,
        email: updatedJudge.email,
        role: updatedJudge.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating judge",
      error: error.message,
    });
  }
};

// Delete judge
export const deleteJudge = async (req, res) => {
  try {
    const { eventId, judgeId } = req.params;

    const judge = await User.findById(judgeId);
    if (!judge) {
      return res.status(404).json({ message: "Judge not found" });
    }

    if (judge.role !== "judge") {
      return res.status(400).json({ message: "User is not a judge" });
    }

    // Remove judge from event
    await Event.findByIdAndUpdate(eventId, {
      $pull: { judges: judgeId },
    });

    // Delete votes associated with this judge
    await Vote.deleteMany({ judge: judgeId });

    // Delete the judge user
    await User.findByIdAndDelete(judgeId);

    res.json({ message: "Judge deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting judge",
      error: error.message,
    });
  }
};
