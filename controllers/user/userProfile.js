const User = require("../../models/user");
const { setUser, getUser } = require("../../service/auth");
const jwt = require("jsonwebtoken");
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

//Get authenticated user's profile
async function handleGetUserProfile(req, res) {
  try {
    const token = await getTokenFromHeader(req);

    const user = await getUser(token); 

    if (!user) {
      return res.status(401).json({ status: "Login required" });
    }

    const existingUser = await User.findOne({ email: user.email }); 

    if (!existingUser) {
      return res.status(404).json({ status: "User not found" });
    }

    return res.json(existingUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

//Get another user's profile
async function handleGetAnotherUserProfile(req, res) {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ status: "User doesn't exist." });
    }

    const {
      password,
      email,
      city,
      zip_code,
      _id,
      createdAt,
      updatedAt,
      __v,
      ...userDetails
    } = user.toObject();

    return res.json(userDetails);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getUserId(req, res){
const username = req.params.username;
const user = await User.findOne({ username });
res.json({userId: user._id});
}

//Update the profile of authenticated user
async function handleUpdateUserProfile(req, res) {
  const token = req.cookies.token;

  const { name, email, username, city, country, zip_code, categories } =
    req.body;

  const user = await getUser(token);



  if (!user) {
    return res.json({ Status: "Login required" });
  }

  const updateFields = {};

  if (name) updateFields.name = name;
  if (email) updateFields.email = email;
  if (username) updateFields.username = username;
  if (city) updateFields.city = city;
  if (country) updateFields.country = country;
  if (zip_code) updateFields.zip_code = zip_code;
  if (categories) updateFields.categories = categories;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: user.email },
      updateFields
    );

    if (!updatedUser) {
      return res.status(404).json({ status: "User not found" });
    }

    return res.json({ status: "User updated!" });
  } catch (error) {
    res.status(500).json({ status: error });
  }
}

module.exports = {
  handleGetUserProfile,
  handleGetAnotherUserProfile,
  handleUpdateUserProfile,
  getUserId
};
