const express = require("express");
const router = express.Router();
const User = require("../models/users.js"); // Import the User model
const settings = require("../models/settings.js");

// Middleware to require login for protected routes
function requireLogin(req, res, next) {
  const userid = req.session.userid;
  if (!userid) {
    // Store the original URL of the settings page in the session
    req.session.originalUrl = req.originalUrl;
    return res.redirect("/login");
  }
  next();
}

// Get user settings page
router.get("/", requireLogin, async (req, res) => {
  const userid = req.session.userid;
  try {
    const userSettings = await settings.getUserSettings(userid);
    if (!userSettings) {
      // Handle the case when no user settings are found
      return res.status(404).send("User settings not found");
    }
    const { username, background, volume } = userSettings;
    res.render("settings", { userid, username, background, volume }); // Pass the `userid`, `username`, `background`, and `volume` to the view template
  } catch (error) {
    console.error("Failed to retrieve user settings", error);
    res.status(500).send("Internal Server Error");
  }
});


// Get username for the settings page
router.get("/users/:userid", requireLogin, async (req, res) => {
  const userid = req.params.userid;
  try {
    const username = await settings.getUsernameByUserId(userid);
    res.json({ username });
  } catch (error) {
    console.error("Failed to fetch username", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



// Get user background preference
router.get("/background", requireLogin, async (req, res) => {
  const userid = req.session.userid;
  try {
    const userSettings = await settings.getUserSettings(userid);
    res.json({ background: userSettings.background });
  } catch (error) {
    console.error("Failed to retrieve user background", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update user background preference
router.post("/background", requireLogin, async (req, res) => {
  const userid = req.session.userid;
  const { background } = req.body;
  try {
    await settings.updateBackgroundPreference(userid, background);
    res.json({ message: "User background updated successfully" });
  } catch (error) {
    console.error("Failed to update user background", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get user volume preference
router.get("/volume", requireLogin, async (req, res) => {
  const userid = req.session.userid;
  try {
    const userSettings = await settings.getUserSettings(userid);
    res.json({ volume: userSettings.volume });
  } catch (error) {
    console.error("Failed to retrieve user volume", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update user volume preference
router.post("/volume", requireLogin, async (req, res) => {
  const userid = req.session.userid;
  const { volume } = req.body;
  try {
    await settings.updateVolumePreference(userid, volume);
    res.json({ message: "User volume updated successfully" });
  } catch (error) {
    console.error("Failed to update user volume", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete user settings
router.delete("/", requireLogin, async (req, res) => {
  const userid = req.session.userid;
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
