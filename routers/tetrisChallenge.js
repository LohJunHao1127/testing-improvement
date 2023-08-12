const express = require("express");
const createHttpError = require("http-errors");
const router = express.Router();
const records = require("../models/tetrisChallenge.js");
const bodyParser = require("body-parser");
router.use(bodyParser.json());






// update highscore in sql table using userid , gameid and score as input
router.post('/createNewScoreChallenge', async (req, res) => {
  const { userid,  score } = req.body;

  try {
    const result = await records.createNewScoreChallenge(userid,  score);

    if (result) {
      console.log("Highscore updated successfully. User ID:", userid);
      res.status(200).json({ success: true, message: 'Highscore updated successfully' });
    } else {
      console.log("Failed to update highscore. User ID:", userid );
      res.status(400).json({ success: false, message: 'Failed to update highscore' });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




// new endpoint leader board 

router.get("/getHighestScore/:userid", async (req, res) => {//in prog
  const { userid } = req.params;

  try {
    const result = await records.getHighestScore(userid);

    if (result) {
      console.log(result);
      res.status(200).json({ result: result, success: true, message: 'Leaderboard displayed successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Game does not exist' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});




module.exports = router;
