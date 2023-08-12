const pool = require('../database');

// tetrisSettings Endpoint 1: Get tetrisSettings for the user with their userid
module.exports.getSettings = function (userid) {
    return pool.query("SELECT rotateKey, leftKey, rightKey, downKey, dropKey, holdKey, pauseKey ,resetKey FROM tetris_settings WHERE userid = ?", [userid])
        .then((result) => {
            if (result.length === 0) {
                throw new NotFoundError(`Tetris settings not found for user with ID: ${userid}`);
            }
            return result;
        });
};



// tetrisSettings Endpoint 2: Insert new tetrisSettings for a user
module.exports.insertUpdateSettings = function (userid, rotate, left, right, down, drop, hold, pause ,reset) {
    const query = "INSERT INTO tetris_settings (userid, rotateKey, leftKey, rightKey, downKey, dropKey, holdKey, pauseKey,resetKey)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE rotateKey = ?, leftKey = ?, rightKey = ?, downKey = ?, dropKey = ?, holdKey = ?, pauseKey = ?, resetKey = ?";
    const values = [userid, rotate, left, right, down, drop, hold, pause,reset, rotate, left, right, down, drop, hold, pause,reset];

    return pool.query(query, values).then((result) => {
        if (result.affectedRows === 0) {
            throw new InternalServerError(`Error inserting tetris settings for user with ID: ${userid}`);
        }

        console.log("Tetris settings inserted for User ID:", userid);
        return result;
    });
};


