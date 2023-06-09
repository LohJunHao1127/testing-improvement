const pool = require('../database');

module.exports.getLowestscore = function (userid) {
  return pool
    .query("SELECT userid, MIN(highscore) AS LowestHighscore FROM record WHERE userid = ? GROUP BY userid ", [userid])
    .then((result) => {
      console.log(result)
      if (result.length === 0) {
        throw new NotFoundError(`User ${userid} not found`);
      }
      console.log(result)
      return result;
    });
};   

module.exports.getAverageHighscore = function (userid) {
  return pool
    .query("SELECT AVG (highscore) AS average_highscore FROM record WHERE userid = ?", [userid])
    .then((result) => {
      if (result.length === 0 || result[0].average_highscore === null) {
        return null; // Return null when no average high score is found
      }
      console.log(result)
      return result[0][0].average_highscore;
    })
    .catch((error) => {
      throw error; // Re-throw the error to be caught by the catch block in the router
    });
};

// module.exports.updateHighscore = function (userid, highscore) {
//   return pool
//     .query("UPDATE records SET highscore = ? WHERE userid = ?", [highscore, userid])               WORK IN PROGRESS FOR UPDATE
//     .then((result) => {
//       return result.affectedRows > 0; // Return true if at least one row was affected, indicating a successful update
//     });
// };
