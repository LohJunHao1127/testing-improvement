const pool = require('../database');
const { NotFoundError, InternalServerError } = require('../errors'); // Import your error classes

module.exports.createNewScore = function (userid, gameid, score, duration) {
  return pool
  .query(
    "SELECT MAX(highscore) AS maxScore FROM record WHERE userid = ? AND gameid = ?",
    [userid, gameid]
  )
  .then((rows) => {
    const maxScore = rows[0][0].maxScore;
    console.log(rows[0])
    console.log(maxScore)

    if (score < maxScore) {

      return pool
        .query(
          "INSERT INTO record (userid, gameid, score, highscore, duration) VALUES (?, ?, ?, ?, ?)",
          [userid, gameid, score, maxScore,duration]
        )
        .then(() => {
          return {
            success: true,
            message: "Score inserted successfully.",
          };
        })
        .catch((error) => {
          throw new Error(`Failed to insert score: ${error.message}`);
        });
    } else if (score > maxScore || maxScore === null) {
      // If new score is greater than the current highscore or there is no existing highscore, update score and highscore
      return pool
        .query(
          "INSERT INTO record (userid, gameid, score, highscore,duration) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE score = VALUES(score), highscore = VALUES(highscore)",
          [userid, gameid, score, score]
        )
        .then(() => {
          return {
            success: true,
            message: "Score inserted successfully.",
          };
        })
        .catch((error) => {
          throw new Error(`Failed to insert score: ${error.message}`);
        });
    }
  })
  .catch((error) => {
    throw new Error(`Failed to insert score: ${error.message}`);
  });
};


module.exports.getHighscore = function (userid, gameid) {
  return pool
    .query("SELECT MAX(score) AS highscore FROM record WHERE userid = ? AND gameid = ?", [userid, gameid])
    .then((highscores) => {
      if (highscores.length === 0) {
        throw new NotFoundError(`User ${userid} not found`);
      }
      const highscore = highscores[0].highscore;
      console.log("Retrieved highscore:", highscore);
      return { success: true, result: highscore }; // Adjust the format of the returned data
    })
    .catch((error) => {
      console.error("Error retrieving highscore:", error);
      throw new InternalServerError("An error occurred while retrieving the highscore");
    });
};

module.exports.getAllHighscores = function (userid, gameid) { // Add gameid as a parameter
  return pool
    .query("SELECT gameid, MAX(score) AS highscore FROM record WHERE userid = ? GROUP BY gameid", [userid])
    .then((highscores) => {
      if (highscores.length === 0) {
        throw new NotFoundError(`User ${userid} not found`);
      }
      return { success: true, result: highscores }; // Adjust the format of the returned data
    })
    .catch((error) => {
      console.error("Error retrieving all highscores:", error);
      throw new InternalServerError("An error occurred while retrieving all highscores");
    });
};

module.exports.resetHighscores = function (userid) {
  const query = "DELETE FROM record WHERE userid = ?";
  const values = [userid];

  return pool
    .query(query, values)
    .then((result) => {
      if (result.affectedRows === 0) {
        throw new NotFoundError(`User ${userid} not found`);
      }
      console.log("Highscores reset for User ID:", userid);
      return { success: true, message: "Highscores reset successfully." };
    })
    .catch((error) => {
      console.error("Error resetting highscores:", error);
      throw new InternalServerError("An error occurred while resetting highscores");
    });
};

module.exports.getLeaderboard = function (gameid) {
  return pool
    .query(
      "SELECT userid, MAX(score) AS highscore FROM record WHERE gameid = ? GROUP BY userid ORDER BY highscore DESC LIMIT 5",
      [gameid]
    )
    .then((leaderboard) => {
      if (leaderboard.length === 0) {
        throw new NotFoundError(`No records found for game ${gameid}`);
      }
      return { success: true, result: leaderboard }; // Adjust the format of the returned data
    })
    .catch((error) => {
      console.error("Error retrieving leaderboard:", error);
      throw new InternalServerError("An error occurred while retrieving the leaderboard");
    });
};
