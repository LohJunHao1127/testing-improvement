document.addEventListener("DOMContentLoaded", function () {
    
    // Get the delete button element
    const deleteButton = document.getElementById("delete");

    // Add onclick event listener to the delete button
    deleteButton.onclick = function () {
        // Get the user ID from the input field
        const adminID = localStorage.getItem("userid")
        if(adminID == 1){
            const deleteUseridInput = document.getElementById("userid-1");
            const deleteUserid = parseInt(deleteUseridInput.value);
    
            // Perform the delete operation with the user ID
            deleteRecord(deleteUserid);
        }
        

    };

    const deleteSelfButton = document.getElementById("delete-self");

    // Add onclick event listener to the delete button
    deleteSelfButton.onclick = function () {
        // Get the user ID from the input field
        const deleteStoredUserid = localStorage.getItem("userid");

        const deleteUserid = parseInt(deleteStoredUserid);

        // Perform the delete operation with the user ID
        deleteRecord(deleteUserid);
    };


    // Get the display button element
    const displayButton = document.getElementById("display records");

    // Add onclick event listener to the display button
    displayButton.onclick = function () {
        // Get the user ID from the input field
        const displayUseridInput = document.getElementById("userid-2");
        const displayUserid = displayUseridInput.value;

        // Perform the display operation with the user ID
        displayRecords(displayUserid);
    };

    const displayUseridButton = document.getElementById("display userid");

    displayUseridButton.onclick = function () {
        // Get the user ID from the input field
        const Userid = localStorage.getItem("userid");
        const useridContainer = document.getElementById("useridContainer");
        useridContainer.innerHTML = ""; // Clear the existing content
        const useridElement = document.createElement("p");
        useridElement.textContent = `User ID: ${Userid}`;
        useridContainer.appendChild(useridElement);

    };


    const displayButton2 = document.getElementById("display2");

    // Add onclick event listener to the display button
    displayButton2.onclick = function () {
        // Get the user ID from the input field
        const displayUseridInput2 = document.getElementById("userid-3");
        const displayUserid2 = displayUseridInput2.value;

        // Perform the display operation with the user ID
        displayLowestRecords(displayUserid2);
    };

    const displayButton3 = document.getElementById("display3");

    // Add onclick event listener to the display button
    displayButton3.onclick = function () {
    // Get the user ID from the input field
    const displayUseridInput3 = document.getElementById("userid-5");
    const displayUserid3 = displayUseridInput3.value;

    // Perform the display operation with the user ID
    displayAvghighscore(displayUserid3);
  };

//   const displayButton6 = document.getElementById("display6");

//     // Add onclick event listener to the display button
//     displayButton6.onclick = function () {
//     // Get the user ID from the input field
//     const displayUseridInput6 = document.getElementById("userid-5");         //work in progress for create..
//     const displayUserid3 = displayUseridInput3.value;

    
//     displayAvghighscore(displayUserid6);
  

//   const displayButton4 = document.getElementById("display4");

//   // Add onclick event listener to the display button                        //work in progress for UPDATE
//   displayButton4.onclick = function () {
//     // Get the user ID from the input field
//     const displayUseridInput4 = document.getElementById("userid-4");
//     const displayUserid4 = displayUseridInput4.value;

//     // Get the new high score from the input field
//     const scoreInput = document.getElementById("score");
//     const newHighscore = scoreInput.value;

//     if (newHighscore !== "") {
//       updateHighscore(displayUserid4, newHighscore);
//     };


    // Get the display leaderboard button element
    const displayLeaderboardButton = document.getElementById("display leaderboard");

    // Add onclick event listener to the display leaderboard button
    displayLeaderboardButton.onclick = function () {
        // Get the game ID from the input field
        const displayLeaderboardGameidInput = document.getElementById("gameid");
        const displayLeaderboardGameid = displayLeaderboardGameidInput.value;

        // Perform the display leaderboard operation with the game ID
        displayLeaderboard(displayLeaderboardGameid);
    };
});


// Function to delete the record with the provided user ID
function deleteRecord(userid) {
    fetch("/api/highscore/delete", {
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


// Function to display all records for the provided user ID
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

// Function to display the average high score for the provided user ID
function displayAvghighscore(userid) {
    // Make the API request to retrieve the average high score for the provided user ID
    const url = `/api/records/average/${userid}`;
    fetch(url)
      .then((response) => {
        // Check the URL of the response
        console.log("Connected to:", response.url);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.success) {
          if (data.result !== null && typeof data.result !== 'undefined') {
            const averageHighscore = data.result;
            alert(`Average high score for User ID ${userid}: ${averageHighscore}`);
          } else {
            alert(`No average high score found for User ID ${userid}`);
          }
        } else {
          alert("Failed to retrieve data. Please try again.");
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
  

  function displayLowestRecords(userid) {
    // Make the API request or retrieve the records from the database
    const url = `/api/records/lowest/${userid}`;
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
                const recordContainer = document.getElementById("recordContainer2");
                recordContainer.innerHTML = ""; // Clear the existing content

                for (let record of records) {
                    const recordElement = document.createElement("p");
                    recordElement.textContent = `User ID: ${record.userid}, Lowest highscore: ${record.LowestHighscore}`;
                    recordContainer.appendChild(recordElement);
                }
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

// function updateHighscore(userid, newHighscore) {
//     // Make the API request to update the highscore in the database
//     const url = `/api/records/userid/${userid}`;
//     fetch(url, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ highscore: newHighscore }),
//     })
//       .then((response) => {
//         // Check the URL of the response
//         console.log("Connected to:", response.url);
//         return response.json();
//       })
//       .then((data) => {
//         console.log(data);
//         if (data.success) {
//           alert("Highscore updated successfully.");
//         } else {
//           alert("Failed to update highscore. Please try again.");
//           console.error("Error:", data);
//           // Log additional information about the error
//           console.log("Error status:", data.status);
//           console.log("Error message:", data.message);
//         }
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         // Log additional information about the error
//         console.log("Error status:", error.status);
//         console.log("Error message:", error.message);
//       });
//   }