const Event = require("../../models/eventModel");
const { getUser } = require("../../service/auth");
const User = require("../../models/user");

async function handleApplyEvent(req, res) {
  const eventId = req.params.eventId;
  const token = req.headers["authorization"]?.split(" ")[1];

  try {
    const user = await getUser(token);
    console.log(user);

    if (!user) {
      return res.status(401).json({ status: "Not Authenticated" });
    }

    const userInfo = await User.find({ username: user.username });


    const eventToApply = await Event.findById(eventId);

    if (!eventToApply) {
      return res.status(404).json({ status: "Event not found" });
    }

    // Check if user is already in waiting list
    const userInWaitingList = eventToApply.waitingList.find(
      (participant) => participant.userId.toString() === user._id.toString()
    );

    if (userInWaitingList) {
      return res
        .status(400)
        .json({ status: "You are already on the waiting list" });
    }

    // Add user to waiting list with points and experience
    if (
      eventToApply.waitingList.length <
      eventToApply.noOfPlayersRequired + 5
    ) {
      const userPoints = userInfo[0].points; // Replace with actual points retrieval
      const userExperience = userInfo[0].experience;

      eventToApply.waitingList.push({
        userId: user._id,
        username: user.username,
        points: userPoints,
        experience: userExperience,
      });

      await eventToApply.save();
    } else {
      return res.json({ status: "Waiting list is already full." });
    }

    // Check if user needs to be moved to participants list
    let userInParticipantsList = eventToApply.participants.find(
      (participant) => participant.userId.toString() === user._id.toString()
    );

    if (
      !userInParticipantsList &&
      eventToApply.participants.length < eventToApply.noOfPlayersRequired
    ) {
      const participantsList = eventToApply.waitingList
        .slice(0, eventToApply.noOfPlayersRequired)
        .map((participant) => ({
          userId: participant.userId,
          username: participant.username,
          points: participant.points,
          experience: participant.experience,
        }));

      eventToApply.participants = participantsList;
      await eventToApply.save();

      userInParticipantsList = participantsList.find(
        (participant) => participant.userId.toString() === user._id.toString()
      );
    }

    const statusMessage = userInParticipantsList
      ? "You are in the participants list"
      : "You are in the waiting list";

    return res.json({
      status: "Applied to event successfully",
      listStatus: statusMessage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "Server error" });
  }
}

module.exports = { handleApplyEvent };
