const Event = require("../../models/eventModel");
const { getUser } = require("../../service/auth");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const getTokenFromHeader = async (req) => {
  const authHeader = await req.headers["authorization"];
 
  if (!authHeader) {
    return null;
  }

  const token = authHeader.split(" ")[1]; // Split Bearer and token

  return token || null;
};

async function handleApplyEvent(req, res) {
  const eventId = await req.params.eventId;
  const token = await getTokenFromHeader(req);

  try {
    const user = await getUser(token);

    if (!user) {
      return res.status(401).json({ status: "Not Authenticated" });
    }

    const eventToApply = await Event.findById(eventId);

    if (!eventToApply) {
      return res.status(404).json({ status: "Event not found" });
    }

    const userInWaitingList = eventToApply.waitingList.find(
      (participant) => participant.username === user.username
    );

    if (userInWaitingList) {
      return res
        .status(400)
        .json({ status: "You are already on the waiting list" });
    }

    if (
      eventToApply.waitingList.length <
      eventToApply.noOfPlayersRequired + 5
    ) {
      eventToApply.waitingList.push({
        userId: user._id,
        username: user.username,
      });
      await eventToApply.save();
    } else {
      return res.json({ status: "Waiting list is already full." });
    }

    if (eventToApply.participants.length < eventToApply.noOfPlayersRequired) {
      const participantsList = eventToApply.waitingList
        .slice(0, eventToApply.noOfPlayersRequired)
        .map((participant) => ({
          userId: participant.userId,
          username: participant.username,
        }));
      eventToApply.participants = participantsList;
      await eventToApply.save();
    }

    return res.json({ status: "Applied to event successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "Server error" });
  }
}

module.exports = { handleApplyEvent };