const express = require("express");
const createHttpError = require("http-errors");
const router = express.Router();
const gamerecords = require("../models/2048records.js");
const bodyParser = require("body-parser");
router.use(bodyParser.json());

// Endpoint to insert a new highscore for a user
router.post('/insert', async (req, res) => {
  const { userid, gameid, score, duration } = req.body;

  try {
    const promises = [];
    promises.push(gamerecords.createNewScore(userid, gameid, score, duration));

    Promise.all(promises)
      .then((results) => {
        const result = results[0];

        if (result.success) {
          res.status(200).json({ success: true, result, message: 'Score created successfully' });
        } else {
          res.status(400).json({ success: false, message: 'Score is not higher. Not updated.' });
        }
      })
      .catch(() => {
        res.status(500).json({ message: 'Internal server error' });
      });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to get the highscore for a specific user and game
router.get('/highscore/:userid/:gameid', (req, res) => {
  const { userid, gameid } = req.params;

  gamerecords.getHighscore(userid, gameid)
    .then((highscore) => {
      res.json({ highscore });
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: error.message });
    });
});

// Endpoint to get all highscores for a specific user
router.get('/highscores/:userid/:gameid', (req, res) => {
  const { userid, gameid } = req.params;

  gamerecords.getAllHighscores(userid, gameid) // Update the function to accept both parameters
    .then((highscores) => {
      res.json(highscores);
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: error.message });
    });
});

//delete highscore
router.delete("/delete", async (req, res) => {
  const { userid } = req.body;

  try {
    const result = await gamerecords.resetHighscores(userid);
    if (result) {
      res.status(200).json({ success: true, message: 'Highscore deleted successfully' });
    } else {
      res.status(400).json({ success: false, message: 'User does not exist' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Endpoint to get the leaderboard for a specific game
router.get('/leaderboard/:gameid', (req, res) => {
  const { gameid } = req.params;

  gamerecords.getLeaderboard(gameid)
    .then((leaderboard) => {
      res.json(leaderboard);
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: error.message });
    });
});

module.exports = router;
