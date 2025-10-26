import express from "express";

const router = express.Router();

// API info route
router.get("/", (req, res) => {
  res.json({
    message: "Tabulator API",
    version: "1.0.0",
    endpoints: {
      admin: {
        auth: [
          "POST /api/admin/register - Register admin",
          "POST /api/admin/login - Admin login",
        ],
        dashboard: ["GET /api/admin/dashboard - Get dashboard stats"],
        events: [
          "GET /api/admin/events - Get all events",
          "POST /api/admin/events - Create event",
          "GET /api/admin/events/:id - Get single event",
          "PUT /api/admin/events/:id - Update event",
          "DELETE /api/admin/events/:id - Delete event",
        ],
        categories: [
          "GET /api/admin/events/:eventId/categories - Get categories",
          "POST /api/admin/events/:eventId/categories - Add category",
          "PUT /api/admin/events/:eventId/categories/:categoryId - Update category",
          "DELETE /api/admin/events/:eventId/categories/:categoryId - Delete category",
        ],
        candidates: [
          "GET /api/admin/events/:eventId/candidates - Get candidates",
          "POST /api/admin/events/:eventId/candidates - Add candidate",
          "PUT /api/admin/events/:eventId/candidates/:candidateId - Update candidate",
          "DELETE /api/admin/events/:eventId/candidates/:candidateId - Delete candidate",
        ],
        judges: [
          "GET /api/admin/events/:eventId/judges - Get judges",
          "POST /api/admin/events/:eventId/judges - Add judge",
          "PUT /api/admin/events/:eventId/judges/:judgeId - Update judge",
          "DELETE /api/admin/events/:eventId/judges/:judgeId - Delete judge",
        ],
      },
      votes: [
        "POST /api/votes - Submit vote",
        "GET /api/votes/ranking/:eventId - Get event ranking",
        "GET /api/votes/judge/:judgeId - Get votes by judge",
        "PUT /api/votes/:voteId - Update vote",
        "DELETE /api/votes/:voteId - Delete vote",
      ],
    },
  });
});

export default router;
