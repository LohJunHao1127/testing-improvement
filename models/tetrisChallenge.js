const pool = require('../database');

// tetris_challenge Endpoint 1: Insert score 



module.exports.createNewScoreChallenge = function (userid, score) {
  return pool
    .query(
      "SELECT phase FROM tetris_challenge WHERE userid = ? ORDER BY timestamp DESC LIMIT 1",
      [userid]
    )
    .then((rows) => {
      const phase = rows[0][0].phase;
      if (phase == null || phase == undefined) {
        return pool
          .query(
            "INSERT INTO tetris_challenge (userid, score ,phase) VALUES (?, ? , 'phase_1')",
            [userid, score]
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
      } else {
        console.log(rows[0]);
        console.log(phase + "insertlogic main");
        let insertPhase = null;
        switch (phase) {
          case "phase_1":
            console.log(phase + "insertlogic main phase 1");
            insertPhase = "phase_2";
            break;
          case "phase_2":
            insertPhase = "phase_3";
            console.log(phase + "insertlogic main phase 2");
            break;
          case "phase_3":
            console.log(phase + "insertlogic main phase 3");
            return pool
              .query(
                "INSERT INTO tetris_challenge (userid, score, phase) VALUES (?, (SELECT SUM(score) AS total_score FROM (SELECT score FROM tetris_challenge WHERE userid = ? ORDER BY timestamp DESC LIMIT 3) AS last_scores), ?)",
                [userid, userid, "Completed"]
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
            
          case "Completed":
            console.log(phase + "insertlogic main Completed");
            insertPhase = "phase_1";
            break;
          default:
            throw new Error(`Invalid phase: ${phase}`);
        }
        if (insertPhase != null) {
          return pool
            .query(
              "INSERT INTO tetris_challenge (userid, score, phase) VALUES (?, ?, ?)",
              [userid, score, insertPhase]
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

      }
    });
};


// tetris_challenge Endpoint 2: Get all scores of the user with their userid 
//changed from ca1
module.exports.getHighestScore = function (userid) {
  return pool
    .query("SELECT score FROM tetris_challenge WHERE userid = ? AND phase = ? ORDER BY timestamp DESC;", [userid, "Completed"])
    .then((result) => {
      if (result.length === 0) {
        throw new NotFoundError(`User ${userid} not found`);
      }
      return result;
    });
};
