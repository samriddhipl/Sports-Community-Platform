const Event = require("../../models/eventModel");

//form team and post 
async function handleTeamFormation(req, res) {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ status: "Event not found" });
    }

    const participantsArray = event.participants;
    const numOfTeams = event.noOfTeamsRequired;

    participantsArray.sort((a, b) => b.points - a.points);

    const teams = Array.from({ length: numOfTeams }, () => ({
      members: [],
      totalPoints: 0,
    }));

    participantsArray.forEach((participant) => {
      let teamWithLowestPoints = teams.reduce((prev, curr) => {
        return prev.totalPoints < curr.totalPoints ? prev : curr;
      });

      teamWithLowestPoints.members.push(participant);
      teamWithLowestPoints.totalPoints += participant.points;
    });

    event.teams = teams;
    await event.save();

    return res.json({ status: "Teams formed successfully", teams });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "Server error" });
  }
}

//get teams

module.exports = { handleTeamFormation };
