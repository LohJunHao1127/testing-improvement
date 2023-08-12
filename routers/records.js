const express = require("express");
const createHttpError = require("http-errors");
const router = express.Router();
const records = require("../models/records.js");
const bodyParser = require("body-parser");
router.use(bodyParser.json());


// GET Highscore using userid and gameid displaying highscore 

// UPDATE records using userid and gameid to reset the highscore 

// INSERT records using userid, gameid and newScore changing the 
// highscore to the newScore if it is higher than the old highscore 
// or when the newScore is lower than the highscore it would take the 
// highscore from the MAX(highscore) and use that to be inserted into the new row

//GET all highscores by userid

//GET all highscore into a leaderboard

//DELETE all of a users records by their userid


//getting all highscore to be displayed with userid as input

router.get("/AllScore/:userid/:gameid", async (req, res) => {
  const { userid,gameid } = req.params;

  try {
    const result = await records.getAllScore(userid,gameid);
    console.log(result);
    if (result) {
      res.status(200).json({ result: result, success: true, message: 'Highscore displayed successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Highscore or user does not exist' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/getHighscore/:userid/:gameid", async (req, res) => {
  const userid = req.params.userid;
  const gameid = req.params.gameid;

  try {
    console.log("Received GET request for highscore. User ID:", userid, "Game ID:", gameid);

    const result = await records.getHighscore(userid, gameid);

    if (result != null || result != undefined) {
      console.log("Highscore retrieved successfully. User ID:", userid, "Game ID:", gameid);
      res.status(200).json({ success: true, highscore: result, message: 'Highscore displayed successfully' });
    } else {
      console.log("Failed to retrieve highscore. User ID:", userid, "Game ID:", gameid);
      res.status(400).json({ success: false, message: 'Highscore or user does not exist' });
    }
  } catch (error) {
    console.error('Error:', error);
    console.log("An error occurred while retrieving highscore. User ID:", userid, "Game ID:", gameid);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.put("/reset/:userid/:gameid", async (req, res) => {
  const userid = req.params.userid;
  const gameid = req.params.gameid;

  try {
    console.log("Resetting highscore. User ID:", userid, "Game ID:", gameid);

    const result = await records.resetHighscore(userid, gameid);

    if (result) {
      console.log("Highscore reset successfully. User ID:", userid, "Game ID:", gameid);
      res.status(200).json({ success: true, highscore: 0, message: 'Highscore reset successfully' });
    } else {
      console.log("Failed to reset highscore. User ID:", userid, "Game ID:", gameid);
      res.status(400).json({ success: false, message: 'User does not exist' });
    }
  } catch (error) {
    console.error('Error:', error);
    console.log("An error occurred while resetting highscore. User ID:", userid, "Game ID:", gameid);
    res.status(500).json({ error: 'An error occurred' });
  }
});




// update highscore in sql table using userid , gameid and score as input
router.post('/createNewScore', async (req, res) => {
  const { userid, gameid, score } = req.body;

  try {
    const promises = [];
    promises.push(records.createNewScore(userid, gameid, score));

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

// update highscore in sql table using userid , gameid and score as input
router.post('/createNewScoreTime', async (req, res) => {
  const { userid, gameid, score,time } = req.body;

  try {
    const promises = [];
    promises.push(records.createNewScoreTime(userid, gameid, score,time));

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



// new endpoint leader board 

router.get("/leaderboard/:gameid", async (req, res) => {//in prog
  const { gameid } = req.params;

  try {
    const result = await records.getLeaderboard(gameid);

    if (result) {
      res.status(200).json({ result: result, success: true, message: 'Leaderboard displayed successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Game does not exist' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// when user delete their account 
router.delete("/delete", async (req, res) => {//working
  const { userid } = req.body;

  try {
    const result = await records.deleteHighscores(userid);
    if (result) {
      res.status(200).json({ success: true, message: 'Highscore deleted successfully' });
    } else {
      res.status(400).json({ success: false, message: 'User does not exist' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});


//retrieve game history based on gameid and userid
router.get("/getAllHighscore/:userid/:gameid/:date", async (req, res) => {
  const userid = req.params.userid;
  const gameid = req.params.gameid;
  const date = req.params.date;

  records.getAllHighscore(userid, gameid, date)
    .then(function (list) {
      res.json({ data: list });
    })
    .catch(function (error) {
      next(error);
    });
});



router.get("/getGamesPlayedOverTime/:userid", async (req, res) => {//in prog
  const { userid } = req.params;

  try {
    const result = await records.getGamesPlayedOverTime(userid);

    if (result) {
      res.status(200).json({ result: result, success: true, message: 'AvgScoreOverTime displayed successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Game does not exist' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/getGamesPopularity", async (req, res) => {//in prog

  try {
    const result = await records.getGamesPopularity();

    if (result) {
      res.status(200).json({ result: result, success: true, message: 'GamesPopularity displayed successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Game does not exist' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});





module.exports = router;


// router.get("/api/highscore", async (req, res) => {
//   try {
//       const highscore = await records.getAllHighscore();
//       res.json({ highscore });
//   } catch (error) {
//       console.error('Error:', error);
//       res.status(500).json({ error: 'An error occurred' });
//   }
// });


// // Define a GET endpoint to retrieve the highscore
// router.get('/highscore', function(req, res) {
//   database.getHighScore()
//     .then(highscore => {
//       res.json({ highscore });
//     })
//     .catch(error => {
//       res.status(500).json({ error: 'Failed to retrieve highscore' });
//     });
// });