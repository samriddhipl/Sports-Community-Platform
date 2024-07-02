const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

function setUser(user) {
  return jwt.sign(
    { 
      _id: user._id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET
  );
}

async function getUser(token) {
  try {
    if (!token) return null;

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    console.error("Error verifying JWT:", err.message);
    return null;
  }
}

module.exports = { setUser, getUser };
