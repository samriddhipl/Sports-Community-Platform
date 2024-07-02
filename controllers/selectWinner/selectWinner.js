const mongoose = require("mongoose");
const Event = require("../../models/eventModel");
const { getUser } = require("../../service/auth");
const User = require("../../models/user");
const dotenv = require("dotenv");

dotenv.config();

const getTokenFromHeader = async (req) => {
  const authHeader = await req.headers["authorization"];
  if (!authHeader) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  return token || null;
};

async function handleSelectWinner(req, res) {
  const token = await getTokenFromHeader(req);
  if (!token) {
    return res.status(401).send("Authorization token is required");
  }

  const user = await getUser(token);
  if (!user) {
    return res.status(401).send("Invalid authorization token");
  }

  const eventId = req.params.eventId;
  const { teamId } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send("Event not found");
    }

    if (event.organizerUsername !== user.username) {
      return res
        .status(403)
        .send(
          "You are not authorized to select the winning team for this event"
        );
    }

    const winningTeam = event.teams.find((team) => team.id === Number(teamId));
    if (!winningTeam) {
      return res.status(404).send("Team not found");
    }

    event.winner = Number(teamId);
    console.log(event.winner);

    const updateWinningTeamPoints = winningTeam.members.map(async (member) => {
      const user = await User.findById(member.userId);

      if (user) {
        user.points += 20;
        await user.save();
      }
    });

    await Promise.all(updateWinningTeamPoints);

    const updateOtherTeamsPoints = event.teams.map(async (team) => {
      if (team.id !== Number(teamId)) {
        const updateTeamMembersPoints = team.members.map(async (member) => {
          const user = await User.findById(member.userId);
          if (user) {
            user.points += 5;
            await user.save();
            console.log(user.points);
          }
        });
        await Promise.all(updateTeamMembersPoints); //this ensures all the async operations in updateTeamMembersPoints are completed before moving on to the next async operation in updateOtherTeamsPoints
      }
    });

    await Promise.all(updateOtherTeamsPoints);

    await event.save();

    res.status(200).send("Winning team selected and points updated");
  } catch (error) {
    console.error("Error selecting winning team:", error);
    res.status(500).send("Server Error");
  }
}

module.exports = { handleSelectWinner };
