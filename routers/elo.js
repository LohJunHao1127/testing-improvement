const express = require("express");
const createHttpError = require("http-errors");
const { NotFoundError, DuplicateEntryError } = require("../errors");
const { updateWinnerElo, updateLoserElo } = require("../models/elo");
const router = express.Router();

router.get("/UpdateElo/:username", function (req, res) {
  const { username } = req.params;

  // Update the user's elo from the database
  updateWinnerElo(username)
    .then((credits) => {
      console.log("winner Elo updated successfully");
      res.json({ success: true, elo });
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    });
});

router.get("/UpdateElo/:username", function (req, res) {
  const { username } = req.params;

  // Update the user's elo from the database
  updateLoserElo(username)
    .then((credits) => {
      console.log("Loser Elo updated successfully");
      res.json({ success: true, elo });
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    });
});

module.exports = router;