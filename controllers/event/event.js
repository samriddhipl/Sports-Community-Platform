const Event = require("../../models/eventModel");
const { getUser } = require("../../service/auth");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const getTokenFromHeader = async (req) => {
  const authHeader = await req.headers["authorization"];
  console.log(authHeader);
  if (!authHeader) {
    return null;
  }

  const token = authHeader.split(" ")[1]; // Split Bearer and token

  return token || null;
};

// Create event endpoint
async function handlePostEvent(req, res) {
  const token = getTokenFromHeader(req);

  if (!token) {
    return res.status(401).json({ status: "Unauthorized" });
  }

  try {
    const user = await getUser(token);

    if (!user) {
      return res.status(401).json({ status: "Not Authenticated" });
    }

    const {
      title,
      description,
      date,
      time,
      city,
      country,
      noOfTeamsRequired,
      noOfPlayersRequired,
      slotsLeft,
      photo,
      categories,
    } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      time,
      city,
      country,
      noOfTeamsRequired,
      noOfPlayersRequired,
      slotsLeft,
      organizerUsername: user.username,
      photo,
      categories,
    });

    return res.status(201).json({ status: "Event Posted!", event });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ error: "Server Error" });
  }
}

//get all events
async function handleGetAllEvents(req, res) {
  try {
    const allEvents = await Event.find({});
    return res.status(200).json(allEvents);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getAuthenticatedUserEvents(req, res) {
  const token = await getTokenFromHeader(req);
  console.log(token);

  try {
    const user = await getUser(token);

    if (!user) {
      return res.status(401).json({ status: "Not Authenticated" });
    }

    const userEvents = await Event.find({ organizerUsername: user.username });

    return res.status(200).json(userEvents);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "Server error" });
  }
}

async function getHomePageEvents(req, res) {
  try {
    const token = await getTokenFromHeader(req);
    const user = await getUser(token);

    if (!user) {
      return res.status(401).json({ status: "Not Authenticated" });
    }

    // Correct query to find events not organized by the authenticated user
    const userEvents = await Event.find({ organizerUsername: { $ne: user.username } });

    return res.status(200).json(userEvents);
  } catch (error) {
    console.error("Error fetching homepage events:", error);
    return res.status(500).json({ status: "Server error" });
  }
}


//get event by eventID
async function handleGetEventById(req, res) {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ status: "Event not found" });
    }

    return res.status(200).json(event);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

//update event
async function handleUpdateEvent(req, res) {
  const token = req.cookies.token;
  const eventId = req.params.eventId;

  const {
    title,
    description,
    date,
    time,
    country,
    city,
    noOfPlayersRequired,
    noOfTeamsRequired,
    slotsLeft,
    organizerUsername,
    photo,
    categories,
  } = req.body;

  const user = await getUser(token);

  if (!user) {
    return res.json({ status: "Login required" });
  }

  const updatedFields = {};

  if (title) updatedFields.title = title;
  if (description) updatedFields.description = description;
  if (date) updatedFields.date = date;
  if (time) updatedFields.time = time;
  if (country) updatedFields.country = country;
  if (city) updatedFields.city = city;
  if (noOfPlayersRequired)
    updatedFields.noOfPlayersRequired = noOfPlayersRequired;
  if (noOfTeamsRequired) updatedFields.noOfTeamsRequired = noOfTeamsRequired;
  if (slotsLeft) updatedFields.slotsLeft = slotsLeft;
  if (organizerUsername) updatedFields.organizerUsername = organizerUsername;
  if (photo) updatedFields.photo = photo;
  if (categories) updatedFields.categories = categories;

  try {
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, organizerUsername: user.username },
      updatedFields,
      { new: true }
    );
    if (!updatedEvent) {
      return res
        .status(404)
        .json({ status: "Event not found or not organized by this user" });
    }

    return res.json({ status: "Event updated!", event: updatedEvent });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

//delete event
async function handleDeleteEvent(req, res) {
  const eventId = req.params.eventId;
  const token = req.cookies.token;

  try {
    const user = await getUser(token);

    if (!user) {
      return res.json({ status: "Login required" });
    }

    const eventToDelete = await Event.findOne({
      _id: eventId,
      organizerUsername: user.username,
    });

    if (!eventToDelete) {
      return res
        .status(404)
        .json({ status: "Event not found or not organized by this user" });
    }

    await Event.deleteOne({ _id: eventId, organizerUsername: user.username });

    return res.status(200).json({ status: "Event was deleted." });
  } catch (error) {
    console.error("Error occurred:", error); // Added logging for better debugging
    return res
      .status(500)
      .json({ status: "Error occurred", error: error.message });
  }
}

module.exports = {
  handlePostEvent,
  handleGetAllEvents,
  handleGetEventById,
  handleUpdateEvent,
  handleDeleteEvent,
  getAuthenticatedUserEvents,
  getHomePageEvents,
};
