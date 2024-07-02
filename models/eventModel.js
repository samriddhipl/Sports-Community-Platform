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
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
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
        points: { type: Number, default: 0 },
        experience: {
          type: Number,
          default: 0,
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
        points: { type: Number, default: 1 },
        experience: {
          type: Number,
          default: 0,
        },
      },
    ],
    teams: [
      {
        id: {
          type: Number,
        },
        members: [
          {
            userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
            username: {
              type: String,
            },
            points: {
              type: Number,
            },
          },
        ],
        totalPoints: {
          type: Number,
          default: 0,
        },
        totalExperience: {
          type: Number,
          default: 0,
        },
      },
    ],
    winner: {
      type: Number,
      default: null,
    },
  
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
