const express = require("express");
const router = express.Router();
const {
  handlePostEvent,
  handleGetAllEvents,
  handleGetEventById,
  handleUpdateEvent,
  handleDeleteEvent,
  getAuthenticatedUserEvents,
  getHomePageEvents,
} = require("../controllers/event/event");
const { handleApplyEvent } = require("../controllers/event/eventApplication");
const { handleTeamFormation } = require("../controllers/team/teamFormation");

router.post("/", handlePostEvent);
router.get("/", handleGetAllEvents);
router.get("/user", getAuthenticatedUserEvents);
router.get("/events", getHomePageEvents); // Corrected route definition
router.get("/:eventId", handleGetEventById);
router.patch("/:eventId", handleUpdateEvent);
router.delete("/:eventId", handleDeleteEvent);

// Apply to event
router.post("/apply/:eventId", handleApplyEvent);

// Team formation
router.get("/team/:eventId", handleTeamFormation);

module.exports = router;
