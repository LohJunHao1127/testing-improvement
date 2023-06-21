const express = require("express");
const router = express.Router();
const settings = require("../models/settings.js");
const bodyParser = require("body-parser");
router.use(bodyParser.json());

// Middleware to require login for protected routes
// function requireLogin(req, res, next) {
//   const userid = req.session.userid;
//   if (!userid) {
//     // Store the original URL of the settings page in the session
//     req.session.originalUrl = req.originalUrl;
//     return res.redirect("/login");
//   }
//   next();
// }

// Get user settings page
router.get("/:userid/favorite-settings", async (req, res) => {
  const userid = req.params.userid;
  try {
    const userSettings = await settings.getUserSettings(userid);
    if (!userSettings) {
      // Handle the case when no user settings are found
      return res.status(404).send("User settings not found");
    }
    const { background, volume } = userSettings;

    res.status(200).json({ background:background ,volume:volume , success: true, message: 'Settings retrieved successfully' });
  } catch (error) {
    console.error("Failed to retrieve user settings", error);
    res.status(500).send("Internal Server Error");
  }
});


// Get username for the settings page
router.get("/username/:userid", async (req, res) => {
  const userid = req.params.userid;
  try {
    console.log("username-test");
    const username = await settings.getUsernameByUserId(userid);
    console.log(username + "tesing router");
    res.status(200).json({ username: username, success: true, message: 'username retrieved successfully' });
  } catch (error) {
    console.error("Failed to fetch username", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



// Get user background preference
router.get("/background/:userid", async (req, res) => {
  const userid = req.params.userid;
  try {
    const userSettings = await settings.getUserSettings(userid);
    res.json({ background: userSettings.background });
  } catch (error) {
    console.error("Failed to retrieve user background", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update user background preference
router.post("/background", async (req, res) => {
  
  const { userid,background } = req.body;
  try {
    await settings.updateBackgroundPreference(userid, background);
    res.json({ message: "User background updated successfully" });
  } catch (error) {
    console.error("Failed to update user background", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get user volume preference
router.get("/volume/:userid", async (req, res) => {
  const userid = req.params.userid;
  try {
    const userSettings = await settings.getUserSettings(userid);
    res.json({ volume: userSettings.volume });
  } catch (error) {
    console.error("Failed to retrieve user volume", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update user volume preference
router.post("/volume", async (req, res) => {
  
  const { userid,volume } = req.body;
  try {
    await settings.updateVolumePreference(userid, volume);
    res.json({ message: "User volume updated successfully" });
  } catch (error) {
    console.error("Failed to update user volume", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete user settings
router.delete("/delete/:userid", async (req, res) => {
  const userid = req.params.userid;
  try {
    await settings.deleteUserSettings(userid);
    req.session.destroy(); // Destroy the session after deleting user settings
    res.json({ message: "User settings deleted successfully" });
  } catch (error) {
    console.error("Failed to delete user settings", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
