const { pool } = require("../database");
const { NotFoundError } = require("../errors");
const User = require("../models/users.js");


// Get username by user ID
module.exports.getUsernameByUserId = async (userid) => {
  try {
    const [result] = await pool.query("SELECT username FROM `user` WHERE userid = ?", [userid]);
    if (!result) {
      throw new NotFoundError(`User ${userid} not found`);
    }
    const { username } = result;
    return username;
  } catch (error) {
    throw error;
  }
};


// Get user settings by user ID
module.exports.getUserSettings = async (userid) => {
  try {
    const [settingsResult, user] = await Promise.all([
      pool.query("SELECT * FROM settings WHERE userid = ?", [userid]),
      User.findById(userid)
    ]);

    if (!settingsResult.length) {
      throw new NotFoundError(`Settings not found for user ${userid}`);
    }

    const { background, volume } = settingsResult[0];
    const { username } = user;
    return { username, background, volume };
  } catch (error) {
    throw error;
  }
};

// Create or update user settings
module.exports.updateUserSettings = async (userid, background, volume) => {
  try {
    const existingSettings = await pool.query("SELECT * FROM settings WHERE userid = ?", [userid]);
    if (existingSettings.length) {
      // Settings exist, perform an update
      const response = await pool.query(
        "UPDATE settings SET background = ?, volume = ? WHERE userid = ?",
        [background, volume, userid]
      );
      if (!response.affectedRows) {
        throw new Error(`Failed to update settings for user ${userid}`);
      }
    } else {
      // Settings don't exist, perform an insert
      const response = await pool.query(
        "INSERT INTO settings (userid, background, volume) VALUES (?, ?, ?)",
        [userid, background, volume]
      );
      if (!response.affectedRows) {
        throw new Error(`Failed to create settings for user ${userid}`);
      }
    }
  } catch (error) {
    throw error;
  }
};

// Delete user settings
module.exports.deleteUserSettings = async (userid) => {
  try {
    const response = await pool.query("DELETE FROM settings WHERE userid = ?", [userid]);
    if (!response.affectedRows) {
      throw new NotFoundError(`Settings not found for user ${userid}`);
    }
  } catch (error) {
    throw error;
  }
};

// Update user background preference
module.exports.updateBackgroundPreference = async (userid, background) => {
  try {
    console.log("Updating background preference:", userid, background);
    const response = await pool.query("UPDATE settings SET background = ? WHERE userid = ?", [
      background,
      userid,
    ]);
    console.log("Response:", response);
    if (!response.affectedRows) {
      throw new NotFoundError(`Settings not found for user ${userid}`);
    }
  } catch (error) {
    throw error;
  }
};

// Update user volume preference
module.exports.updateVolumePreference = async (userid, volume) => {
  try {
    console.log("Updating volume preference:", userid, volume);
    const response = await pool.query("UPDATE settings SET volume = ? WHERE userid = ?", [
      volume,
      userid,
    ]);
    console.log("Response:", response);
    if (!response.affectedRows) {
      throw new NotFoundError(`Settings not found for user ${userid}`);
    }
  } catch (error) {
    throw error;
  }
};
