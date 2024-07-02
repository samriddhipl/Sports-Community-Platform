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
  handleGetParticularUsersEvent
 
} = require("../controllers/event/event");
const { handleApplyEvent } = require("../controllers/event/eventApplication");
const { handleTeamFormation } = require("../controllers/team/teamFormation");
const {
  handleSelectWinner,
} = require("../controllers/selectWinner/selectWinner");
const {
  handleGetRecommendedEvents,
} = require("../controllers/event/recommendedEvents");

router.post("/", handlePostEvent);
router.get("/", handleGetAllEvents);
router.get("/user", getAuthenticatedUserEvents);
router.get("/events", getHomePageEvents);
router.get("/:eventId", handleGetEventById);
router.patch("/:eventId", handleUpdateEvent);
router.delete("/:eventId", handleDeleteEvent);
router.get("/:userId/events",handleGetParticularUsersEvent )

// Apply to event
router.post("/apply/:eventId", handleApplyEvent);

// Team formation
router.get("/team/:eventId", handleTeamFormation);

router.post("/select-winner/:eventId", handleSelectWinner);
router.get("/recommendedEvents/:username", handleGetRecommendedEvents);


module.exports = router;
