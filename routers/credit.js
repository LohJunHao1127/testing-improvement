const express = require("express");
const createHttpError = require("http-errors");
const { NotFoundError, DuplicateEntryError } = require("../errors");
const {
  updateUserCredits,
  getUserCredits
} = require("../models/credit.js");
const router = express.Router();

// POST /api/update-credits endpoint
router.post("/insertCredits", function (req, res) {
  const { userid, credits } = req.body;

  // Update the user's credits in the database
  updateUserCredits(userid, credits)
    .then(() => {
      console.log("Credits updated successfully");
      res.json({ success: true });
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    });
});

// POST /api/retrieve-credits endpoint
router.post("/retrieveCredits", function (req, res) {
  const { userid } = req.body;

  // Retrieve the user's credits from the database
  getUserCredits(userid)
    .then((credits) => {
      console.log(`Retrieved credits: {${credits}}`)
      res.json({ success: true, credits });
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    });
});

module.exports = router;