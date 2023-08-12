document.addEventListener("DOMContentLoaded", function() {
  const getPrimaryUser = () => {
    return new Promise((resolve, reject) => {
      const playerImage = document.querySelector(".player-image");
      const playerName = document.querySelector(".player-name");
      const eloScore = document.querySelector(".elo-score");

      fetch("/api/gameOver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid: localStorage.getItem("userid") }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            playerImage.src = data.image;
            playerName.textContent = data.username;
            eloScore.textContent = data.elo;
            resolve(); // Resolve the promise
          } else {
            reject("Failed to fetch primary user data"); // Reject the promise with an error message
          }
        })
        .catch((error) => {
          reject(error); // Reject the promise with the caught error
        });
    });
  };

  const getSecondaryUser = () => {
    return new Promise((resolve, reject) => {
      const playerImage = document.querySelector(".player2-image");
      const playerName = document.querySelector(".player2-name");
      const eloScore = document.querySelector(".elo2-score");

      fetch("/api/gameOver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secondary_User: localStorage.getItem("userid") }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            playerImage.src = data.image;
            playerName.textContent = data.username;
            eloScore.textContent = data.elo;
            resolve(); // Resolve the promise
          } else {
            reject("Failed to fetch secondary user data"); // Reject the promise with an error message
          }
        })
        .catch((error) => {
          reject(error); // Reject the promise with the caught error
        });
    });
  };

  // Sequentially run the functions using promises
  getPrimaryUser()
    .then(() => getSecondaryUser())
    .catch((error) => console.error("Error:", error));
});
