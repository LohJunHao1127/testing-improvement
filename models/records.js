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


module.exports.createNewScoreTime = function (userid, gameid, score ,time) {
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
            "INSERT INTO record (userid, gameid, score, highscore,duration) VALUES (?, ?, ?, ? , ?)",
            [userid, gameid, score, maxScore , time]
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
            "INSERT INTO record (userid, gameid, score, highscore ,duration) VALUES (?, ?, ?, ? ,?) ON DUPLICATE KEY UPDATE score = VALUES(score), highscore = VALUES(highscore)",
            [userid, gameid, score, score , time]
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







// Records Endpoint 2: Get all scores of the user with their userid and gameid
//changed from ca1
module.exports.getAllScore = function (userid,gameid) {
  return pool
    .query("SELECT score ,timestamp FROM record WHERE userid = ? AND gameid =? ORDER BY timestamp ASC;", [userid,gameid])
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
    .query("SELECT DISTINCT u.username, MAX(r.highscore) AS highscore FROM record r INNER JOIN user u ON u.userid = r.userid WHERE r.gameid = ? GROUP BY r.userid ORDER BY highscore DESC LIMIT 5;", [gameid])
    .then((result) => {
      if (result.length === 0) {
        throw new NotFoundError(`No records found for game ${gameid}`);
      }
      return result;
    });
};

// Endpoint for retrieve game history based on gameid and userid
module.exports.getAllHighscore = function (userid, gameid, date) {
  return pool
    .query("SELECT * FROM record WHERE userid = ? AND gameid = ? AND DATE(timestamp) = ?", [userid, gameid, date])
    .then((result) => {
      if (result.length === 0) {
        throw new NotFoundError(`User ${userid} not found`);
      }
      return result;
    });
};

module.exports.getGamesPlayedOverTime  = function (userid ) {
  return pool
    .query("SELECT DATE(timestamp) AS date, SUM(games_played) AS total_games_played FROM ( SELECT u.username, r.gameid, DATE(timestamp) AS timestamp, COUNT(*) AS games_played FROM record r INNER JOIN user u ON u.userid = r.userid WHERE u.userid = ? GROUP BY u.username, r.gameid, DATE(timestamp) ) AS subquery GROUP BY DATE(timestamp) ORDER BY DATE(timestamp) ASC;", [userid])
    .then((result) => {
      if (result.length === 0) {
        throw new NotFoundError(`No records found for user ${userid}`);
      }
      return result;
    });
};

module.exports.getGamesPopularity = function () {
  return pool
    .query(`
    SELECT r.gameid, COUNT(*) AS total_games_played
    FROM record r
    WHERE r.gameid > 0
    GROUP BY r.gameid
    ORDER BY total_games_played DESC;
    `)
    .then((result) => {
      if (result.length === 0) {
        throw new NotFoundError(`No game records found`);
      }
      return result;
    });
};
