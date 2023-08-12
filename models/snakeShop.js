const pool = require('../database')

//  update the status, reject/accepted
module.exports.insertsScore = function insertsScore(score, userid) {
    return pool.query("INSERT INTO snakeShop (score, userId) values (?,?)", [score, userid])
        .then(([response]) => {
            if (!response.affectedRows) throw new Error(`Something went wrong with status updating`);
        })
        .catch((error) => {
            throw error;
        });

};