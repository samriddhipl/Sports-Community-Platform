const express = require("express");
const {
  handleUserSignUp,
  handleUserLogin,
} = require("../controllers/user/userAuth");
const {
  handleGetUserProfile,
  handleGetAnotherUserProfile,
  handleUpdateUserProfile,
} = require("../controllers/user/userProfile");
const {
  followUser,
  unfollowUser,
  handleGetAllFollowers,
  handleGetAllFollowing,
} = require("../controllers/user/followUnfollow");

const router = express.Router();

//Authentication
router.post("/signup", handleUserSignUp);
router.post("/login", handleUserLogin);

//Profile
router.get("/profile", handleGetUserProfile);
router.get("/:username", handleGetAnotherUserProfile);
router.patch("/profile", handleUpdateUserProfile);

// Follow/Unfollow
router.post("/follow/:usernameToFollow", followUser);
router.post("/unfollow/:usernameToUnfollow", unfollowUser);
router.get("/followers/:username", handleGetAllFollowers);
router.get("/following/:username", handleGetAllFollowing);

module.exports = router;
