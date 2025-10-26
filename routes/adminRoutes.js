import express from "express";
import {
  registerAdmin,
  login,
  createEvent,
  addCategory,
  addCandidate,
  addJudge,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  getCategories,
  updateCategory,
  deleteCategory,
  getCandidates,
  updateCandidate,
  deleteCandidate,
  getJudges,
  updateJudge,
  deleteJudge,
  getDashboardStats,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Authentication routes
router.post("/register", registerAdmin);
router.post("/login", login);

// Dashboard
router.get("/dashboard", protect, adminOnly, getDashboardStats);

// Event management routes
router
  .route("/events")
  .get(protect, adminOnly, getEvents)
  .post(protect, adminOnly, createEvent);

router
  .route("/events/:eventId")
  .get(protect, adminOnly, getEvent)
  .put(protect, adminOnly, updateEvent)
  .delete(protect, adminOnly, deleteEvent);

// Category management routes
router
  .route("/events/:eventId/categories")
  .get(protect, adminOnly, getCategories)
  .post(protect, adminOnly, addCategory);

router
  .route("/events/:eventId/categories/:categoryId")
  .put(protect, adminOnly, updateCategory)
  .delete(protect, adminOnly, deleteCategory);

// Candidate management routes
router
  .route("/events/:eventId/candidates")
  .get(protect, adminOnly, getCandidates)
  .post(protect, adminOnly, addCandidate);

router
  .route("/events/:eventId/candidates/:candidateId")
  .put(protect, adminOnly, updateCandidate)
  .delete(protect, adminOnly, deleteCandidate);

// Judge management routes
router
  .route("/events/:eventId/judges")
  .get(protect, adminOnly, getJudges)
  .post(protect, adminOnly, addJudge);

router
  .route("/events/:eventId/judges/:judgeId")
  .put(protect, adminOnly, updateJudge)
  .delete(protect, adminOnly, deleteJudge);

export default router;
