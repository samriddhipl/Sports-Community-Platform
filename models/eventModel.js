const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    noOfTeamsRequired: {
      type: Number,
      required: true,
      default: 1,
    },
    noOfPlayersRequired: {
      type: Number,
      required: true,
      default: 2,
    },
    slotsLeft: {
      type: Number,
    },
    organizerUsername: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    categories: [
      {
        type: String,
      },
    ],
    waitingList: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        username: {
          type: String,
        },
      },
    ],
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        username: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
