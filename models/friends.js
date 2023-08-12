
const pool = require('../database')



//4 sending sql statement
//  to get received friend 
module.exports.getReceivedFriends = function getReceivedFriends(gameid, userid) {
    return pool.query("Select * from friends join user on friends.received_request=user.userid where gameid=? and sent_request=? and status='Pending'", [gameid, userid])
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

//4 sending sql statement
//  to get all friend 
module.exports.getFriends = function getFriends(gameid, userid) {
    return pool.query("Select * from user where userid in (select sent_request from friends where received_request = ? and gameid = ? and status = 'Accepted' union select received_request from friends WHERE sent_request = ? AND gameid = ? AND status = 'Accepted')", [userid, gameid, userid, gameid])
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

//  to get sent request friend 
module.exports.getSentReqFriends = function getSentReqFriends(gameid, userid) {
    return pool.query("Select * from friends join user on friends.sent_request=user.userid where gameid=? and received_request=? and status='Pending'", [gameid, userid])
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

//4 sending sql statement
//  for search name
module.exports.searchByUsername = function searchByUsername(username) {
    return pool.query("SELECT * FROM user WHERE username=?", [username])
        .then(([rows]) => {
            if (!rows || rows.length === 0) {
                throw new Error(`Details not found for username= ${username}`);
            }

            return rows;
        });
};


//4 sending sql statement
//  add friends(request)
module.exports.addNewFriends = function addNewFriends(gameid, received_request, sent_request) {
    return pool.query("INSERT INTO friends (gameid,received_request, sent_request) VALUES (?, ?,?)", [gameid, received_request, sent_request])
        .then(([result]) => {
            if (result.affectedRows !== 1) {
                throw new Error(`Can't add friend. Please try again`);
            }
        })
        .catch((error) => {
            throw error;
        });
};


//updated code from above
//  remove sent friend request
module.exports.deleteFriends = function deleteFriends(received_request, sent_request, gameId) {
    return pool.query("DELETE FROM friends WHERE received_request=? AND sent_request=? and gameid=?", [received_request, sent_request, gameId])
        .then(([response]) => {
            if (!response.affectedRows) throw new Error(`Can't delete friend. Please try again`);
        })
        .catch((error) => {
            throw error;
        });
};

//  update the status, reject/accepted
module.exports.updateStatus = function updateStatus(status, id) {
    return pool.query("UPDATE friends set status=? where id=?", [status, id])
        .then(([response]) => {
            if (!response.affectedRows) throw new Error(`Something went wrong with status updating`);
        })
        .catch((error) => {
            throw error;
        });

};


