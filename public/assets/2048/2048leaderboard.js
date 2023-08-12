document.addEventListener("DOMContentLoaded", function () {
  const loggedInUserId = getLoggedInUserId();
  const gameId = localStorage.getItem("gameid"); // Retrieve gameid from local storage

  const displayLeaderboardButton = document.getElementById("displayLeaderboardButton");
  const displayRecordsButton = document.getElementById("displayRecordsButton");
  const deleteRecordButton = document.getElementById("deleteRecordButton");

  if (displayLeaderboardButton) {
    displayLeaderboardButton.addEventListener("click", () => {
      displayLeaderboard(gameId, loggedInUserId);
      displayPersonalBest(loggedInUserId, gameId); // Display personal best score
    });
  }

  if (displayRecordsButton) {
    displayRecordsButton.addEventListener("click", () => {
      displayRecords(loggedInUserId, gameId);
      displayPersonalBest(loggedInUserId, gameId); // Display personal best score
    });
  }

  if (deleteRecordButton) {
    deleteRecordButton.addEventListener("click", () => {
      deleteRecord(loggedInUserId);
    });
  }

  // Add this button event listener
  const displayPersonalBestButton = document.getElementById("displayPersonalBestButton");
  if (displayPersonalBestButton) {
    displayPersonalBestButton.addEventListener("click", () => {
      displayPersonalBest(loggedInUserId, gameId);
    });
  }
});



function displayLeaderboard(gameid, userId) {
  const url = `/api/2048records/leaderboard/${gameid}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const leaderboardContainer = document.getElementById("leaderboardContainer");
      leaderboardContainer.innerHTML = ""; // Clear the existing content

      if (data.success) {
        alert("Leaderboard retrieved successfully.");
        const leaderboardArr = data.result[0];

        if (leaderboardArr.length === 0) {
          const noScoresElement = document.createElement("p");
          noScoresElement.textContent = "No scores available";
          leaderboardContainer.appendChild(noScoresElement);
        } else {
          for (let leaderboard of leaderboardArr) {
            const leaderboardElement = document.createElement("p");
            leaderboardElement.textContent = `User ID: ${leaderboard.userid}, Highscore: ${leaderboard.highscore}`;
            leaderboardContainer.appendChild(leaderboardElement);
          }
        }
      } else {
        handleApiError(data);
      }
    })
    .catch(handleFetchError);
}

function displayRecords(userId, gameId) {
  const url = `/api/2048records/highscores/${userId}/${gameId}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const recordContainer = document.getElementById("recordContainer");
      recordContainer.innerHTML = ""; // Clear the existing content

      if (data.success) {
        alert("Userid, gameid and highscore retrieved successfully.");
        const records = data.result[0];

        if (records.length === 0) {
          const noScoresElement = document.createElement("p");
          noScoresElement.textContent = "No scores available";
          recordContainer.appendChild(noScoresElement);
        } else {
          for (let record of records) {
            const recordElement = document.createElement("p");
            recordElement.textContent = `User ID: ${record.userid}, Game ID: ${record.gameid}, Highscore: ${record.highscore}, Score: ${record.score}`;
            recordContainer.appendChild(recordElement);
          }
        }
      } else {
        handleApiError(data);
      }
    })
    .catch(handleFetchError);
}
function displayPersonalBest(userId, gameId) {
  const url = `/api/2048records/highscore/${userId}/${gameId}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const personalScoreContainer = document.getElementById("personalScore");
      personalScoreContainer.innerHTML = ""; // Clear the existing content

      if (data.success) {
        const records = data.result[0];
        if (records.length === 0) {
          const noScoresElement = document.createElement("p");
          noScoresElement.textContent = "No scores available";
          personalScoreContainer.appendChild(noScoresElement);
        } else {
          // Find the highest highscore among the records
          const highestHighscore = records.reduce((max, record) => Math.max(max, record.highscore), -1);

          const personalScoreElement = document.createElement("p");
          personalScoreElement.textContent = `Personal Best Highscore: ${highestHighscore}`;
          personalScoreContainer.appendChild(personalScoreElement);
        }
      } else {
        handleApiError(data);
      }
    })
    .catch(handleFetchError);
}


function deleteRecord(userid) {
  fetch("/api/2048records/delete", {
      method: "DELETE",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          userid
      }),
  })
      .then((response) => {
          // Check the URL of the response
          console.log("Connected to:", response.url);
          return response.json();
      })
      .then((data) => {
          console.log(data);
          if (data.success) {
              alert("Score Deleted successfully.");
          } else {
              alert("Failed to delete score. Please try again.");
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


function getLoggedInUserId() {
  return localStorage.getItem("userid");
}

function handleApiError(data) {
  alert("An error occurred. Please try again.");
  console.error("Error:", data);
  console.log("Error status:", data.status);
  console.log("Error message:", data.message);
}

function handleFetchError(error) {
  alert("An error occurred. Please try again.");
  console.error("Error:", error);
  console.log("Error status:", error.status);
  console.log("Error message:", error.message);
}


function goToHomepage() {
  // Replace this with the actual URL of your 2048 home page
  window.location.href = "2048home.html";
}

function goToGame() {
  // Replace this with the actual URL of your 2048 game page
  window.location.href = "2048.html";
}
function goToSettingsPage() {
  window.location.href = "../../pages/settings.html";
}