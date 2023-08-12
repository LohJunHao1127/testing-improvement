const pool = require('../database')

// Function to update the user's credits in the database
module.exports.updateUserCredits = function updateUserCredits(userid, credits) {
  return pool
    .query("UPDATE user SET credits = ? WHERE userid = ?", [
      credits,
      userid,
    ])
    .then(() => {
      // Credits updated successfully
      return;
    });
};

// Function to retrieve the user's credits from the database
module.exports.getUserCredits = function getUserCredits(userid) {
  return pool
    .query("SELECT credits FROM user WHERE userid = ?", [userid])
    .then((result) => {
      const credits = result[0][0].credits;
      console.log(result[0][0].credits);
      return credits;
    });
};
