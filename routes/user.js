const express = require("express");
const {
  handleUserSignUp,
  handleUserLogin,
} = require("../controllers/user/userAuth");
const {
  handleGetUserProfile,
  handleGetAnotherUserProfile,
  handleUpdateUserProfile,
  getUserId

} = require("../controllers/user/userProfile");
const {
  followUser,
  unfollowUser,
  handleGetAllFollowers,
  handleGetAllFollowing,
  checkFollowingStatus
  
} = require("../controllers/user/followUnfollow");
const {
  handleGetRecommendedEvents,
} = require("../controllers/event/recommendedEvents");

const router = express.Router();

//Authentication
router.post("/signup", handleUserSignUp);
router.post("/login", handleUserLogin);

//Profile
router.get("/profile", handleGetUserProfile);
router.get("/:username", handleGetAnotherUserProfile);
router.patch("/profile", handleUpdateUserProfile);
router.get("/getuserid/:username", getUserId)

// Follow/Unfollow
router.post("/follow/:usernameToFollow", followUser);
router.post("/unfollow/:usernameToUnfollow", unfollowUser);
router.get("/followers/:username", handleGetAllFollowers);
router.get("/following/:username", handleGetAllFollowing);
router.get("/check-following/:usernameToCheck", checkFollowingStatus);



module.exports = router;
