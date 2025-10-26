import Event from "../models/eventModel.js";
import Category from "../models/categoryModel.js";
import Candidate from "../models/candidateModel.js";
import User from "../models/userModel.js";

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("categories", "name")
      .populate("judges", "name email")
      .sort({ date: -1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id)
      .populate("categories", "name")
      .populate("judges", "name email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create new event
export const createEvent = async (req, res) => {
  try {
    const { name, date } = req.body;

    if (!name || !date) {
      return res.status(400).json({ message: "Name and date are required" });
    }

    const event = await Event.create({ name, date });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date } = req.body;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.name = name || event.name;
    event.date = date || event.date;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Delete associated categories and candidates
    await Category.deleteMany({ event: id });
    await Candidate.deleteMany({ event: id });

    await Event.findByIdAndDelete(id);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get event categories
export const getEventCategories = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id).populate("categories");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event.categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get event judges
export const getEventJudges = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id).populate("judges", "name email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event.judges);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add judge to event
export const addJudgeToEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { judgeId } = req.body;

    const event = await Event.findById(id);
    const judge = await User.findById(judgeId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!judge) {
      return res.status(404).json({ message: "Judge not found" });
    }

    if (judge.role !== "judge") {
      return res.status(400).json({ message: "User is not a judge" });
    }

    if (event.judges.includes(judgeId)) {
      return res
        .status(400)
        .json({ message: "Judge already assigned to this event" });
    }

    event.judges.push(judgeId);
    await event.save();

    const updatedEvent = await Event.findById(id).populate(
      "judges",
      "name email"
    );
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove judge from event
export const removeJudgeFromEvent = async (req, res) => {
  try {
    const { id, judgeId } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!event.judges.includes(judgeId)) {
      return res
        .status(400)
        .json({ message: "Judge not assigned to this event" });
    }

    event.judges = event.judges.filter((judge) => judge.toString() !== judgeId);
    await event.save();

    const updatedEvent = await Event.findById(id).populate(
      "judges",
      "name email"
    );
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get event statistics
export const getEventStats = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const categoriesCount = await Category.countDocuments({ event: id });
    const candidatesCount = await Candidate.countDocuments({ event: id });
    const judgesCount = event.judges.length;

    res.json({
      eventId: id,
      eventName: event.name,
      eventDate: event.date,
      categoriesCount,
      candidatesCount,
      judgesCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
