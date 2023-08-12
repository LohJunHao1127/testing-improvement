function displayLeaderboard(gameid) {
  // Make the API request or retrieve the records from the database
  const url = `/api/highscore/leaderboard/${gameid}`;
  fetch(url)
    .then((response) => {
      // Check the URL of the response
      console.log("Connected to:", response.url);
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (data.success) {
        alert("Leaderboard retrieved successfully.");

        const leaderboardArr = data.result[0]; // Access the leaderboard array correctly
        const leaderboardContainer = document.getElementById(
          "blackjackLeaderBoardContainer"
        );
        leaderboardContainer.innerHTML = ""; // Clear the existing content

        for (let leaderboard of leaderboardArr) {
          const leaderboardElement = document.createElement("p");
          leaderboardElement.textContent = `User ID: ${leaderboard.userid}, Highscore: ${leaderboard.highscore}`;
          leaderboardContainer.appendChild(leaderboardElement);
        }
      } else {
        alert("Failed to retrieve leaderboard. Please try again.");
        console.error("Error:", data);
        // Log additional information about the error
        console.log("Error status:", data.status);
        console.log("Error message:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // Log additional information about the error
      console.log("Error status:", error.status);
      console.log("Error message:", error.message);
    });
}

function retrieveHighscore() {
    const storedUserId = localStorage.getItem("userid");
    const storedGameId = localStorage.getItem("gameid");
    const userid = parseInt(storedUserId);
    const gameid = parseInt(storedGameId);
  
    if (isNaN(userid) || isNaN(gameid)) {
      alert("Please go back to main.html and try again");
      return;
    }
  
    // Construct the URL with query parameters
    const url = `/api/highscore/getHighscore/${userid}/${gameid}`;
  
    // Send the GET request to the API
    fetch(url)
      .then((response) => {
        // Check the URL of the response
        console.log("Connected to:", response.url);
        return response.json();
      })
      .then((data) => {
        console.log(data.highscore);
        console.log(data.success)
        if (data.success) {
  
          alert("Score retrieved successfully.");
          // Update the high score element in the HTML
          console.log(data.highscore);
          const highscoreValueElement =
            document.getElementById("score");
          highscoreValueElement.textContent = data.highscore;
        } else {
          alert("Failed to retrieve score. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Log additional information about the error
        console.log("Error status:", error.status);
        console.log("Error message:", error.message);
      });
  }


document.addEventListener("DOMContentLoaded", function () {
    let storedgameid = localStorage.getItem("gameid");
    let gameid = parseInt(storedgameid);
    displayLeaderboard(gameid);
    retrieveHighscore();

  });
