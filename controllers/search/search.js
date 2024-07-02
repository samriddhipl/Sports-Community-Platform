const Event = require("../../models/eventModel");

const handleSearchEvents = async (req, res) => {
    const query = req.query.query;
    try {
    
      const events = await Event.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { organizerUsername: { $regex: query, $options: 'i' } },
          { city: { $regex: query, $options: 'i' } },
          { country: { $regex: query, $options: 'i' } },
        ],
      });
  
      res.json(events);
    } catch (error) {
      console.error('Error searching events:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
  handleSearchEvents,
};
