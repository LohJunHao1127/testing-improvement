const express = require("express");
const createHttpError = require("http-errors");
const {
  getUserInfo,
  updateUserInfo,
  deleteUserInfo,
  addNewUser,
  getUserInfoByUserId,
  getItemInfo,
} = require("../models/users");
const bodyParser = require("body-parser");
const router = express.Router();

router.use(bodyParser.json());

router.post("/api/profile", function (req, res) {
  var userid = req.body.userid;

  getUserInfoByUserId(userid)
    .then((user) => {
      res.json({
        success: true,
        username: user.username,
        email: user.email,
        password: user.password,
        image: user.image,
        credits: user.credits,
        elo: user.elo,
      });
    })
    .catch((error) => {
      res.json({ success: false });
    });
});

// POST /api/login endpoint
router.post("/api/login", function (req, res) {
  const { username, password } = req.body;

  // Validate the user's credentials against the database
  getUserInfo(username)
    .then((user) => {
      if (user.password === password) {
        console.log("Valid user. Logging in.");
        // Credentials are valid
        res.json({ success: true, userid: user.userid });
      } else {
        // Invalid credentials
        res.json({ success: false });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    });
});

// PUT updateUser endpoint
router.put("/api/update", function (req, res) {
  let userid = req.body.userid;
  // let userid = parseInt(req.params.userid);
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  if (!username || !email || !password) {
    return res.status(400).json({ error_msg: "Please provide all fields." });
  }

  let promises = [];

  if (username !== undefined && email === undefined && password === undefined) {
    promises.push(updateUserInfo(userid, username, null, null));
  } else if (
    username === undefined &&
    email !== undefined &&
    password === undefined
  ) {
    promises.push(updateUserInfo(userid, null, email, null));
  } else if (
    username === undefined &&
    email === undefined &&
    password !== undefined
  ) {
    promises.push(updateUserInfo(userid, null, null, password));
  } else if (
    username !== undefined &&
    email !== undefined &&
    password !== undefined
  ) {
    promises.push(updateUserInfo(userid, username, email, password));
  }

  Promise.all(promises)
    .then(() => {
      res
        .type("application/json")
        .json({ success: true, success_msg: "User updated successfully" });
    })
    .catch((err) => {
      if (err.name === "NotFoundError") {
        res.status(404).json({ error_msg: "User not found" });
      } else {
        console.error(err);
        res.status(500).json({ error_msg: "Internal server error" });
      }
    });
});

function isValidEmail(email) {
  // Regular expression pattern for email validation
  // Returns true if email is valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  // Regular expression pattern for password validation
  // Returns true if password is valid
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/;
  return passwordRegex.test(password);
}

// POST /api/users endpoint
router.post("/api/register", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  console.log(req.body);

  // Check for undefined or null values
  if (
    typeof username === undefined ||
    username === null ||
    typeof password === undefined ||
    password === null ||
    typeof email === undefined ||
    email === null
  ) {
    res.status(400).json({ error_msg: "Missing data" });
  } else {
    // validates the user input, ensuring data integrity and security, before proceeding with user registration
    if (!isValidEmail(email)) {
      res.status(400).json({ error_msg: "Invalid email format" });
      return;
    }
    if (!isValidPassword(password)) {
      res.status(400).json({ error_msg: "Invalid password format" });
      return;
    }

    // If all validation checks pass, proceed with user registration
    addNewUser(username, password, email)
      .then((result) => {
        res
          .status(201)
          .json({ success: true, message: "User created successfully" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error_msg: "Internal server error" });
      });
  }
});

// DELETE deleteUser endpoint
router.delete("/api/delete", function (req, res) {
  let userid = parseInt(req.body.userid);

  // Call a function to delete the user with the given ID
  deleteUserInfo(userid)
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false });
    });
});

router.post("/api/gameOver", function (req, res) {
  var userid = req.body.userid;

  getUserStuffByUserId(userid)
    .then((user) => {
      res.json({
        success: true,
        username: user.username,
        image: user.image,
        eloScore: user.elo,
      });
    })
    .catch((error) => {
      res.json({ success: false });
    });
});

module.exports = router;
