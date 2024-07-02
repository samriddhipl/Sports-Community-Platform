const express = require("express");
const mongoose = require("mongoose");
const Event = require("../../models/eventModel"); 
const { getUser } = require("../../service/auth"); 
const geolib = require("geolib"); 
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

const handleGetRecommendedEvents = async (req, res) => {
  try {
    const token = await getTokenFromHeader(req);
    console.log(token);

    const username = req.params.username;

    if (!token) {
      return res.status(401).json({ status: "Unauthorized" });
    }

    const user = await getUser(token);

    if (!user) {
      return res.status(401).json({ status: "Unauthorized" });
    }

    const userLocation = [user?.latitude][user?.longitude]; 

    const userCategories = user.categories || [];

    let query = { date: { $gte: new Date() } }; 
    if (userLocation) {
      query.location = { $near: userLocation }; 
    }

 
    if (userCategories.length > 0) {
      query.categories = { $in: userCategories };
    }

   
    events = await Event.find(query).sort({ location: 1 });
    events = events.filter((event) => event.organizerUsername != user.username);

  
    if (userLocation) {
      const userPoint = {
        latitude: userLocation[1],
        longitude: userLocation[0],
      }; 

      events.forEach((event) => {
        const eventPoint = {
          latitude: event.location.coordinates[1],
          longitude: event.location.coordinates[0],
        }; 
        const distance = geolib.getDistance(userPoint, eventPoint); 

     
        let weight = 1; 
        if (userCategories.includes(event.category)) {
        
          weight += 0.5;
        }
       

        event.score = distance * weight;
        
      });

      events.sort((a, b) => a.score - b.score); 
    }

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching recommended events:", error);
    return res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { handleGetRecommendedEvents };
