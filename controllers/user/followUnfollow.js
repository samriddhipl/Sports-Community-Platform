const User = require("../../models/user");
const { getUser } = require("../../service/auth");
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

//follow another user
async function followUser(req, res) {
  const token = await getTokenFromHeader(req);
  const { usernameToFollow } = req.params;

  try {
    const currentUser = await getUser(token);

    const user = await User.findOne({ _id: currentUser._id });

    if (!user) {
      return res.status(401).json({ status: "Login required" });
    }

    if (user.username === usernameToFollow) {
      return res.status(400).json({ status: "You can't follow yourself" });
    }

    const userToFollow = await User.findOne({ username: usernameToFollow });

    if (!userToFollow) {
      return res.status(404).json({ status: "User to follow not found" });
    }

    if (userToFollow.followers.includes(user._id)) {
      return res.status(400).json({ status: "You already follow this user" });
    }

    if (!userToFollow.followers) {
      userToFollow.followers = [];
    }
    if (!user.following) {
      user.following = [];
    }

    userToFollow.followers.push(user._id);
    user.following.push(userToFollow._id);

    await user.save();
    await userToFollow.save();

    return res.json({ status: "User followed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "Server error" });
  }
}

//unfollow another user
async function unfollowUser(req, res) {
  const token = await getTokenFromHeader(req);
  const { usernameToUnfollow } = req.params;

  try {
    const currentUser = await getUser(token);
    const user = await User.findOne({ _id: currentUser._id });

    if (!user) {
      return res.status(401).json({ status: "Login required" });
    }

    if (user.username === usernameToUnfollow) {
      return res.status(400).json({ status: "You can't unfollow yourself" });
    }

    const userToUnfollow = await User.findOne({ username: usernameToUnfollow });

    if (!userToUnfollow) {
      return res.status(404).json({ status: "User to unfollow not found" });
    }

    if (!userToUnfollow.followers.includes(user._id)) {
      return res.status(400).json({ status: "You do not follow this user" });
    }

    if (!userToUnfollow.followers) {
      userToUnfollow.followers = [];
    }
    if (!user.following) {
      user.following = [];
    }

    userToUnfollow.followers.pull(user._id);
    user.following.pull(userToUnfollow._id);

    await user.save();
    await userToUnfollow.save();

    return res.json({ status: "User unfollowed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "Server error" });
  }
}

//get all followers
async function handleGetAllFollowers(req, res) {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ status: "User not found" });
    }

    const followers = user.followers;

    return res.json(followers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "Server error" });
  }
}

//get all followings
async function handleGetAllFollowing(req, res) {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ status: "User not found" });
    }

    const following = user.following;

    return res.json(following);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "Server error" });
  }
}
async function checkFollowingStatus(req, res) {
  const token = await getTokenFromHeader(req);
  const { usernameToCheck } = req.params;

  try {
    const curr = await getUser(token);
    const currentUser = await User.findOne({ username: curr.username });

    const user = await User.findOne({ username: usernameToCheck });

    if (!currentUser) {
      return res.status(401).json({ status: "Login required" });
    }
    console.log(currentUser);

    console.log(typeof(currentUser.following))

    const isFollowing = currentUser.following.includes(user._id);

    return res.json({ isFollowing });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "Server error" });
  }
}

module.exports = {
  followUser,
  unfollowUser,
  handleGetAllFollowers,
  handleGetAllFollowing,
  checkFollowingStatus,
};
