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
          const leaderboardContainer = document.getElementById("chessLeaderBoardContainer");
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
  document.addEventListener("DOMContentLoaded", function () {
    let storedgameid = localStorage.getItem("gameid");
    let gameid = parseInt(storedgameid);
    displayLeaderboard(gameid);
  });

  // secondary user login function
  function storeToLocalStorage(key, value) {
    localStorage.setItem(key, value);
  }
  
  function retrieveFromLocalStorage(key) {
    localStorage.getItem(key);
  }
  
  // Logging into the application
  document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.querySelector(".login-form");
    const loginButton = document.querySelector(".login-form button[type='submit']");
  
    loginButton.addEventListener("click", function(event) {
      event.preventDefault(); // Prevent form submission
  
      const usernameInput = document.getElementById("username");
      const passwordInput = document.getElementById("password");
      const username = usernameInput.value;
      const password = passwordInput.value;
  
      // Send request to validate credentials
      fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // console.log(data);
            storeToLocalStorage("secondary_User", data.userid);
            storeToLocalStorage("blackUsername", username);
            alert("secondary user successfully logged in");
            window.location.href = "../chess/chess.html"; // Redirect to index.html
          } else {
            alert("Username and password not found. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  });
  