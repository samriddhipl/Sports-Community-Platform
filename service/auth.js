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

    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error("Error verifying JWT:", error.message);
    return null;
  }
}

module.exports = { setUser, getUser };
