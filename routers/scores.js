const express = require("express");
const createHttpError = require("http-errors");
const router = express.Router();
const records = require("../models/scores.js");
const bodyParser = require("body-parser");
router.use(bodyParser.json());


router.get("/lowest/:userid", async (req, res) => {
  const { userid } = req.params;

  try {
    const resultPromise = records.getLowestscore(userid);

    // Make additional requests concurrently using Promise.all()
    const [result] = await Promise.all([resultPromise]);

    console.log(result);
    if (result) {
      res.status(200).json({ result: result, success: true, message: 'Lowest score displayed successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Lowest score or user does not exist' });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



router.get("/average/:userid", async (req, res) => {
  const { userid } = req.params;

  try {
    const resultPromise = records.getAverageHighscore(userid);

    // Make additional requests concurrently using Promise.all()
    const [result] = await Promise.all([resultPromise]);

    console.log(result);
    if (result) {
      res.status(200).json({ result: result, success: true, message: 'Average score displayed successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Average score or user does not exist' });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

function createRecord(userid, highscore) {
  // Make the API request to create a new record in the database
  const url = "/api/records";
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userid: userid, highscore: highscore }),
  })
    .then((response) => {
      // Check the URL of the response
      console.log("Connected to:", response.url);
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (data.success) {
        alert("Record created successfully.");
      } else {
        alert("Failed to create record. Please try again.");
        console.error("Error:", data);
        // Log additional information about the error
        console.log("Error status:", data.status);
        console.log("Error message:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // Log additional information about the error
      console.log("Error status:", error.status);
      console.log("Error message:", error.message);
    });
}

// router.put("/api/records/userid/:userid", async (req, res) => {
//   const { userid } = req.params;
//   const { highscore } = req.body;

//   try {
//     const result = await records.updateHighscore(userid, highscore);
//     console.log(result);
//     if (result) {
//       res.status(200).json({ success: true, message: "High score updated successfully" });     WORK IN PROGRESS FOR UPDATE
//     } else {
//       res.status(400).json({ success: false, message: "Failed to update high score" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// });



module.exports = router;