const Event = require("../../models/eventModel");

async function handleTeamFormation(req, res) {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ status: "Event not found" });
    }

    const participantsArray = event.participants;
    const numOfTeams = event.noOfTeamsRequired;

    // Sort participants by points in descending order
    participantsArray.sort((a, b) => b.points - a.points);

    // Initialize teams
    const teams = Array.from({ length: numOfTeams }, () => ({
      members: [],
      totalPoints: 0,
    }));

    // Randomize the starting point
    let startIndex = Math.floor(Math.random() * numOfTeams);

    // Distribute participants among teams
    participantsArray.forEach((participant, index) => {
      let teamIndex = (startIndex + index) % numOfTeams;
      teams[teamIndex].members.push(participant);
      teams[teamIndex].totalPoints += participant.points;
    });

    event.teams = teams;
    await event.save();

    return res.json({ status: "Teams formed successfully", teams });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "Server error" });
  }
}

module.exports = { handleTeamFormation };
