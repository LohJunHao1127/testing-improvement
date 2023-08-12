//Copy this functions into your code and put any necessary information
// like the score to be inserted into it





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
          document.getElementById("highscore-value");
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

function resetHighscore() {
  const storedUserId = localStorage.getItem("userid");
  const storedGameId = localStorage.getItem("gameid");
  const userid = parseInt(storedUserId);
  const gameid = parseInt(storedGameId);

  if (isNaN(userid) || isNaN(gameid)) {
    alert("Please go back to main.html and try again");
    return;
  }

  // Construct the URL with query parameters
  const url = `/api/highscore/reset/${userid}/${gameid}`;

  // Send the PUT request to the API
  fetch(url, {
    method: "PUT",
  })
    .then((response) => {
      // Check the URL of the response
      console.log("Connected to:", response.url);
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (data != null && data != undefined) {
        alert("Score reset successfully.");
        // Update the high score element in the HTML
        const highscoreValueElement = document.getElementById("highscore-value");

        highscoreValueElement.textContent = data.highscore;
      } else {
        alert("Failed to reset score. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // Log additional information about the error
      console.log("Error status:", error.status);
      console.log("Error message:", error.message);
    });
}

function createScore(userid, gameid, highscore) {
  // Send the highscore, user ID, and game ID to the API
  fetch("/api/highscore/createNewScore", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userid: userid,
      gameid: gameid,
      score: highscore,
    }),
  })
    .then((response) => {
      // Check the response status code
      if (response.ok) {
        console.log("Connected to:", response.url);
        return response.json();
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    })
    .then((data) => {
      console.log(data);
      if (data.success) {

      } else {
        alert("Failed to submit score. Please try again.");
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
        const leaderboardContainer = document.getElementById("leaderboardContainer");
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

// Function to display all records for the provided user ID
// basically display every single records that the user has done 
function displayRecords(userid) {
  // Make the API request or retrieve the records from the database
  const url = `/api/highscore/Allhighscore/${userid}`;
  fetch(url)
    .then((response) => {
      // Check the URL of the response
      console.log("Connected to:", response.url);
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (data.success) {
        alert("Userid, gameid and highscore retrieved successfully.");

        const records = data.result[0];
        const recordContainer = document.getElementById("recordContainer");
        recordContainer.innerHTML = ""; // Clear the existing content

        for (let record of records) {
          const recordElement = document.createElement("p");
          recordElement.textContent = `User ID: ${record.userid}, Game ID: ${record.gameid}, Highscore: ${record.highscore}, Score: ${record.score}`;
          recordContainer.appendChild(recordElement);
        }
      } else {
        alert("Failed to retrieve score. Please try again.");
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