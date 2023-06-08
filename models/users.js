const pool = require('../database')
const {
  NotFoundError,
  DuplicateEntryError,
  SqlLiteErrorCodes,
} = require("../errors");

// getUserInfo function
module.exports.getUserInfo = function getUserInfo(username) {
  return pool
    .query("SELECT * FROM user WHERE username = ?", [username])
    .then((result) => {
      const user = result[0][0];
      if (!user) throw new NotFoundError(`User ${username} not found`);
      return user;
    });
};

module.exports.getUserInfoByUserId = function getUserInfo(userid) {
  return pool
    .query("SELECT username,email,password FROM user WHERE userid = ?", [userid])
    .then((result) => {
      const user = result[0][0];
      if (!user) throw new NotFoundError(`User ${userid} not found`);
      return user;
    });
};

// updateUserInfo function
module.exports.updateUserInfo = function updateUserInfo(userid, username, email, password) {
  return pool
    .query("UPDATE user SET username = ?, email = ?, password = ? WHERE userid = ?", [username, email, password, userid])
    .then((result) => {
      if (result.affectedRows === 0) {
        throw new Error(`User ${userid} not found`);
      }
    });
};

// deleteUserInfo function
module.exports.deleteUserInfo = function deleteUserInfo(userid) {
  return pool
    .query("DELETE FROM user WHERE userid = ?", [userid])
    .then((result) => {
      if (result.affectedRows === 0) {
        throw new Error(`User ${userid} not found`);
      }
    });
};

// addNewUser function
module.exports.addNewUser = function addNewUser(username, password, email) {
  return pool
    .query("INSERT INTO user(username, password, email) VALUES (?, ?, ?)", [username, password, email])
    .then((result) => {
      const { insertId } = result[0];
      if (!insertId) throw new Error("Failed to add new user");
      return insertId;
    });
};