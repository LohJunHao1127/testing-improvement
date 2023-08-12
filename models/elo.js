const pool = require('../database')


// Function to update the user's credits in the database
module.exports.updateWinnerElo = function updateWinnerElo(username, credits) {
  return pool
    .query("UPDATE user SET elo = ? WHERE username = ?", [
      credits,
      username,
    ])
    .then((result) => {
        const elo = result[0][0].elo;
        return elo
    });
};

// Function to retrieve the user's credits from the database
module.exports.UpdateLoserElo = function UpdateLoserElo(username, credits) {
  return pool
  .query("UPDATE user SET elo = ? WHERE username = ?", [
    credits,
    username,
  ])
    .then((result) => {
      const elo = result[0][0].elo;
      return elo;
    });
};
