const pool = require('../database');

// Records Endpoint 1: Insert highscore after checking if it is the highest.

/** 
  * @param {number} userid - userid of the user that should be inserted
  * @param {number} gameid - gameid of the game that should be inserted
  * @param {number} score - score of the game that should be inserted
  * @returns {Promise<{success: boolean, message: string}>}
  * @throws {Error} - database errors
  * @description Inserts a new score for a user and game. If the score is higher than the current highscore, the highscore will be updated.
  * @example 
  * // Insert a new score for user with ID 1 and game with ID 1
  * const result = await records.createNewScore(1, 1, 100);
  * console.log(result.message); // Expected output: "Score inserted successfully."
  * console.log(result.success); // Expected output: true
  *
  * @example
  * // Attempt to insert a score that is lower than the existing highscore
  * const result2 = await records.createNewScore(1, 1, 50);
  * console.log(result2.message); // Expected output: "Failed to insert score ."
  * console.log(result2.success); // Expected output: false
  *
  * @example
  * // Attempt to insert a score that is higher than the existing highscore
  * const result3 = await records.createNewScore(1, 1, 200);
  * console.log(result3.message); // Expected output: "Score inserted successfully."
  * console.log(result3.success); // Expected output: true

*/

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


/** 
  * @param {number} userid - userid of the user that should be inserted
  * @param {number} gameid - gameid of the game that should be inserted
  * @param {number} score - score of the game that should be inserted
  * @param {number} time - time of the game that should be inserted
  * @returns {Promise<{success: boolean, message: string}>}
  * @throws {Error} - database errors
  * @description Inserts a new score for a user and game alng with the time. If the score is higher than the current highscore, the highscore will be updated.
  * @example 
  * // Insert a new score for user with ID 1 and game with ID 1
  * const result = await records.createNewScore(1, 1, 100 , 100);
  * console.log(result.message); // Expected output: "Score inserted successfully."
  * console.log(result.success); // Expected output: true
  *
  * @example
  * // Attempt to insert a score that is lower than the existing highscore
  * const result2 = await records.createNewScore(1, 1, 50 , 100);
  * console.log(result2.message); // Expected output: "Failed to insert score ."
  * console.log(result2.success); // Expected output: false
  *
  * @example
  * // Attempt to insert a score that is higher than the existing highscore
  * const result3 = await records.createNewScore(1, 1, 200 , 100);
  * console.log(result3.message); // Expected output: "Score inserted successfully."
  * console.log(result3.success); // Expected output: true

*/

module.exports.createNewScoreTime = function (userid, gameid, score, time) {
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
            [userid, gameid, score, maxScore, time]
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
            [userid, gameid, score, score, time]
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








/** 
  * @param {number} userid - userid of the user that is needed to be searched
  * @param {number} gameid - gameid of the game that is needed to be searched
  * @returns {Promise<{success: boolean, message: string}>}
  * @throws {Error} - database errors
  * @description Searches for all the scores of a user and game .
  * @example 
  * // Insert a new score for user with ID 1 and game with ID 1
  * const result = await records.getAllScore(1, 1);
  * console.log(result); // Expected output: "records of the user and game ."
  *
  * @example
  * // Attempt to insert a score that is lower than the existing highscore
  * const result2 = await records.getAllScore(100, 1);
  * console.log(result2); // Expected output: "[]" (empty array)
  * 
*/
module.exports.getAllScore = function (userid, gameid) {
  return pool
    .query("SELECT score ,timestamp FROM record WHERE userid = ? AND gameid =? ORDER BY timestamp ASC;", [userid, gameid])
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

module.exports.getGamesPlayedOverTime = function (userid) {
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
