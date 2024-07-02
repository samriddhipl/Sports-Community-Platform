const { ObjectId } = require("mongoose");
const Event = require("../../models/eventModel");

function initializeTeams(participantsArray, numOfTeams) {
  const teams = Array.from({ length: numOfTeams }, (_, index) => ({
    id: index + 1,
    members: [],
    totalPoints: 0,
    totalExperience: 0,
  }));

  participantsArray.forEach((participant, index) => {
    const teamIndex = index % numOfTeams; //round robin ma team ma assign gareko
    teams[teamIndex].members.push(participant);
    teams[teamIndex].totalPoints += participant.points;
    teams[teamIndex].totalExperience += participant.experience;
  });

  return teams;
}

function fitnessFunction(teams) {
  let score = 0;
  const avgPoints =
    teams.reduce((sum, team) => sum + team.totalPoints, 0) / teams.length;
  const avgExperience =
    teams.reduce((sum, team) => sum + team.totalExperience, 0) / teams.length;

  teams.forEach((team) => {
    score -= Math.abs(team.totalPoints - avgPoints); //calculating fitness score for each team.
    score -= Math.abs(team.totalExperience - avgExperience);
  });
  //less negative value of score = more balanced team.
  //If all teams have points and experience close to the average, the differences will be small. Small differences mean that the penalties subtracted from the score will also be small.
  return score; //harek team combination ko laagi score calculate garne.
}

function getNeighborSolution(currentTeams, participantsArray, numOfTeams) {
  const newTeams = currentTeams.map((team) => ({
    id: team.id,
    members: [...team.members],
    totalPoints: team.totalPoints,
    totalExperience: team.totalExperience,
  })); //naya team banako copy garera purano

  const teamIndex1 = Math.floor(Math.random() * numOfTeams);
  const teamIndex2 = Math.floor(Math.random() * numOfTeams);

  if (teamIndex1 === teamIndex2) return newTeams; //same team vayo vane kei nagarne

  const memberIndex1 = Math.floor(
    Math.random() * newTeams[teamIndex1].members.length
  );
  const memberIndex2 = Math.floor(
    Math.random() * newTeams[teamIndex2].members.length
  );

  const member1 = newTeams[teamIndex1].members[memberIndex1];
  const member2 = newTeams[teamIndex2].members[memberIndex2];

  newTeams[teamIndex1].members[memberIndex1] = member2;
  newTeams[teamIndex2].members[memberIndex2] = member1; //members haru lai swap gareko 


  //recalculate totalPoints and total Experience swap garesi
  newTeams[teamIndex1].totalPoints = newTeams[teamIndex1].members.reduce(
    (sum, member) => sum + member.points,
    0
  );
  newTeams[teamIndex1].totalExperience = newTeams[teamIndex1].members.reduce(
    (sum, member) => sum + member.experience,
    0
  );
  newTeams[teamIndex2].totalPoints = newTeams[teamIndex2].members.reduce(
    (sum, member) => sum + member.points,
    0
  );
  newTeams[teamIndex2].totalExperience = newTeams[teamIndex2].members.reduce(
    (sum, member) => sum + member.experience,
    0
  );

  return newTeams; //current team vanda slightly different team generate garcha
}

function simulatedAnnealing(
  participantsArray,
  numOfTeams,
  initialTemp,
  finalTemp,
  alpha
) {
  let currentSolution = initializeTeams(participantsArray, numOfTeams);
  let bestSolution = currentSolution;
  let currentTemp = initialTemp;

  while (currentTemp > finalTemp) {
    const neighborSolution = getNeighborSolution(
      currentSolution,
      participantsArray,
      numOfTeams
    );
    const currentFitness = fitnessFunction(currentSolution);
    const neighborFitness = fitnessFunction(neighborSolution);

    if (
      neighborFitness > currentFitness ||
      Math.exp((neighborFitness - currentFitness) / currentTemp) > Math.random()
    ) {
      currentSolution = neighborSolution;
    }

    if (fitnessFunction(currentSolution) > fitnessFunction(bestSolution)) {
      bestSolution = currentSolution;
    }

    currentTemp *= alpha;
  }

  return bestSolution;
}

async function handleTeamFormation(req, res) {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ status: "Event not found" });
    }

    if (event.teams && event.teams.length > 0) {
      return res.json({ status: "Teams already formed", teams: event.teams });
    }

    const participantsArray = event.participants;
    console.log("Participants Array:", participantsArray);
    if (!Array.isArray(participantsArray) || participantsArray.length === 0) {
      return res.status(400).json({ status: "Invalid participants data" });
    }

    const numOfTeams = event.noOfTeamsRequired;
    const initialTemp = 100;
    const finalTemp = 0.01;
    const alpha = 0.9;

    participantsArray.sort(
      (a, b) => b.points - a.points || b.experience - a.experience
    );

    const bestTeams = simulatedAnnealing(
      participantsArray,
      numOfTeams,
      initialTemp,
      finalTemp,
      alpha
    );

    event.teams = bestTeams;
    await event.save();

    return res.json({ status: "Teams formed successfully", teams: bestTeams });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "Server error" });
  }
}

module.exports = { handleTeamFormation };
