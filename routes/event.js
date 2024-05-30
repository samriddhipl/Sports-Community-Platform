const express = require("express");
const router = express.Router();
const {
  handlePostEvent,
  handleGetAllEvents,
  handleGetEventById,
  handleUpdateEvent,
  handleDeleteEvent,
} = require("../controllers/event/event");
const { handleApplyEvent } = require("../controllers/event/eventApplication");
const { handleTeamFormation } = require("../controllers/team/teamFormation");

router.post("/", handlePostEvent);
router.get("/", handleGetAllEvents);
router.get("/:eventId", handleGetEventById);
router.patch("/:eventId", handleUpdateEvent);
router.delete("/:eventId", handleDeleteEvent);

//apply to event
router.post("/apply/:eventId", handleApplyEvent);

//team formation
router.post("/team/:eventId", handleTeamFormation);

module.exports = router;
