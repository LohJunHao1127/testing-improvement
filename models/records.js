const pool = require('../database');

// Records Endpoint 1: Insert highscore after checking if it is the highest.



module.exports.createNewScore = function (userid, gameid, score) {
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
            "INSERT INTO record (userid, gameid, score, highscore) VALUES (?, ?, ?, ?)",
            [userid, gameid, score, maxScore]
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
            "INSERT INTO record (userid, gameid, score, highscore) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE score = VALUES(score), highscore = VALUES(highscore)",
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







// Records Endpoint 2: Get all highscores of the user with their userid

module.exports.getAllHighscore = function (userid) {
  return pool
    .query("SELECT userid , gameid , highscore, score FROM record WHERE userid = ?", [userid])
    .then((result) => {
      if (result.length === 0) {
        throw new NotFoundError(`User ${userid} not found`);
      }
      return result;
    });
};

// Records Endpoint 3: Get a specific highscore of the user with their userid and gameid

module.exports.getHighscore = function (userid, gameid) {
  return pool
    .query("SELECT MAX(highscore) AS highscore FROM record WHERE userid = ? AND gameid = ?", [userid, gameid])
    .then((highscores) => {
      if (highscores.length === 0) {
        throw new NotFoundError(`User ${userid} not found`);
      }
      console.log(highscores[0]);
      const highscore = highscores[0][0].highscore;
      console.log("Retrieved highscore:", highscore); 
      return highscore;
    });
};

module.exports.resetHighscore = function (userid, gameid) {
  const query = "UPDATE record SET highscore = 0 WHERE userid = ? AND gameid = ?";
  const values = [userid, gameid];

  return pool.query(query, values)
    .then((result) => {
      if (result.affectedRows === 0) {
        throw new NotFoundError(`User ${userid} not found`);
      }
      
      console.log("Highscore reset for User ID:", userid, "Game ID:", gameid);
      return result;
    })
    .catch((error) => {
      console.error("Error resetting highscore:", error);
      throw new InternalServerError("An error occurred while resetting highscore");
    });
};



// Records Endpoint 4: Delete highscore

module.exports.deleteHighscores = function (userid) {
  return pool
    .query("DELETE FROM record WHERE userid = ?", [userid])
    .then((result) => {
      if (result.affectedRows === 0) {
        throw new NotFoundError(`User ${userid} not found`);
      }
      return result;
    });
};

module.exports.getLeaderboard = function (gameid) {
  return pool
    .query("SELECT DISTINCT userid, MAX(highscore) AS highscore FROM record WHERE gameid = ? GROUP BY userid ORDER BY highscore DESC LIMIT 5", [gameid])
    .then((result) => {
      if (result.length === 0) {
        throw new NotFoundError(`No records found for game ${gameid}`);
      }
      return result;
    });
};

