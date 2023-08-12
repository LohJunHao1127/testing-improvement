const pool = require('../database');


// insert messages in chat table
module.exports.insertMessage = function insertMessage(sender, receiver, message) {
    return pool.query('INSERT INTO chat (sender, receiver, message) VALUES (?, ?, ?)', [sender, receiver, message])
        .then(([response]) => {
            if (!response.affectedRows) throw new Error(`Something went wrong with message insertion`);
        })
        .catch((error) => {
            throw error;
        });
};

// get chat history
module.exports.getMessages = function getMessages(userId, myUserId, myUserId, userId) {
    return pool.query('SELECT * FROM chat WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)', [userId, myUserId, myUserId, userId])
        .then(([rows]) => {
            if (!rows || rows.length === 0) {
                return [];
            }

            return rows;
        })
        .catch((error) => {
            // Handle the error here
            console.error(error);
            throw error;
        });
};

