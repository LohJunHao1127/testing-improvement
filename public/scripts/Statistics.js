document.addEventListener("DOMContentLoaded", function () {

    const StoredUserid = localStorage.getItem("userid");
    const Userid = parseInt(StoredUserid);


    const displayRecordsBtn = document.getElementById("displayRecords");

    displayRecordsBtn.addEventListener("click", () => {

        const displayGameidInput = document.querySelector('input[name="gameid-records"]:checked');
        const displayGameid = displayGameidInput.value;
        const displayUseridInput = localStorage.getItem("userid");
        const displayUserid = parseInt(displayUseridInput);
        // Perform the display operation with the user ID
        displayRecords(displayUserid, displayGameid);
    });




    const displayLeaderboardBtn = document.getElementById("displayLeaderboard");



    displayLeaderboardBtn.addEventListener("click", () => {
        const displayLeaderboardGameidInput = document.querySelector('input[name="gameid-leaderboard"]:checked');
        const displayLeaderboardGameid = displayLeaderboardGameidInput.value;

        // Perform the display leaderboard operation with the game ID
        displayLeaderboard(displayLeaderboardGameid);
    });


    // Create promises for the two functions
    const gamesPlayedPromise = displayGamesPlayedOverTime(Userid);
    console.log("Games Played Over Time Shown:", gamesPlayedPromise);
    const gamesPopularityPromise = displayGamesPopularity();
    console.log("Games Popularity Shown:", gamesPopularityPromise);

    // Execute the promises concurrently using Promise.all()
    Promise.all([gamesPlayedPromise, gamesPopularityPromise])
        .then((results) => {
            
            const gamesPlayedResult = results[0];
            const gamesPopularityResult = results[1];

            // You can now work with the results of both functions here
            console.log('Games Played Over Time Shown in promise:', gamesPlayedResult);
            console.log('Games Popularity Shown in promise:', gamesPopularityResult);
        })
        .catch((error) => {
            console.error('Error:', error);
        });


});


function convertUTCToSGT(utcTimestamp) {
    const utcDate = new Date(utcTimestamp);
    const offset = 8; // Offset for Singapore time (UTC+8)

    utcDate.setHours(utcDate.getHours() + offset);

    return utcDate;
}


// Function to display all records for the provided user ID
function displayRecords(userid, gameid) {
    // Make the API request or retrieve the records from the database
    const url = `/api/highscore/AllScore/${userid}/${gameid}`;
    fetch(url)
        .then((response) => {
            // Check the URL of the response
            console.log("Connected to:", response.url);
            return response.json();
        })
        .then((data) => {
            console.log(data);
            if (data.success) {
                alert("Score And timestamp retrieved successfully.");

                const records = data.result[0];
                console.log(records);

                const labels = records.map((record) => {
                    const sgtTimestamp = convertUTCToSGT(record.timestamp);
                    return sgtTimestamp.toLocaleString('en-SG'); // Format SGT timestamp
                });
                const scores = records.map((record) => record.score);
                if (scores.length > 0) {
                    createLineChart("RecordsChart", labels, scores, "Game Records");
                } else {
                    alert("No records found for the provided user ID and game ID.");
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

            if (data.success) {

                const leaderboardArr = data.result[0];

                let labels = leaderboardArr.map((entry) => entry.username);
                const scores = leaderboardArr.map((entry) => entry.highscore);
                for (let i = 0; i < labels.length; i++) {


                    switch (i) {
                        case 0:
                            labels[i] = "First Place:" + " User " + labels[i];
                            break;
                        case 1:
                            labels[i] = "Second Place:" + " User " + labels[i];
                            break;
                        case 2:
                            labels[i] = "Third Place:" + " User " + labels[i];
                            break;
                        default:
                            labels[i] = `${i + 1}th Place:` + " User " + labels[i];
                            break;

                    }

                }

                createBarChart("leaderboardChart", labels, scores, "Leaderboard");
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

function displayGamesPlayedOverTime(userid) {
    // Make the API request or retrieve the records from the database
    const url = `/api/highscore/getGamesPlayedOverTime/${userid}`;
    fetch(url)
        .then((response) => {
            // Check the URL of the response
            console.log("Connected to:", response.url);
            return response.json();
        })
        .then((data) => {

            if (data.success) {

                const GamesPlayedOverTimeArr = data.result[0];

                let labels = GamesPlayedOverTimeArr.map((entry) => entry.date);
                const scores = GamesPlayedOverTimeArr.map((entry) => entry.total_games_played);


                createLineChart("GamesPlayedOverTimeChart", labels, scores, "Games Played Over Time");
                console.log("Games Played Over Time:", GamesPlayedOverTimeArr);
                return "Success in displaying Games Played Over Time";
            } else {
                alert("Failed to retrieve Games Played Over Time. Please try again.");
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

function displayGamesPopularity() {
    // Make the API request or retrieve the records from the database
    const url = `/api/highscore/getGamesPopularity`;
    fetch(url)
        .then((response) => {
            // Check the URL of the response
            console.log("Connected to:", response.url);
            return response.json();
        })
        .then((data) => {

            if (data.success) {

                const GamesPopularityArr = data.result[0];

                let labels = GamesPopularityArr.map((entry) => entry.gameid);
                for (let i = 0; i < labels.length; i++) {

                    switch (labels[i]) {
                        case 1:
                            labels[i] = "Snake";
                            break;
                        case 2:
                            labels[i] = "2048";
                            break;
                        case 3:
                            labels[i] = "Space-Invaders";
                            break;
                        case 4:
                            labels[i] = "Tetris";
                            break;
                        case 5:
                            labels[i] = "Planet-Defense";

                            break;

                        case 6:
                            labels[i] = "Blackjack";
                            break;
                        case 8:
                            labels[i] = "Minesweeper";
                            break;

                        default:
                            labels[i] = "Unknown";
                            break;
                    }
                }
                const scores = GamesPopularityArr.map((entry) => entry.total_games_played);


                createBarChart("GamesPopularityChart", labels, scores, "Games Popularity");
                return "Success in displaying Games Popularity";
            } else {
                alert("Failed to retrieve Games Played Over Time. Please try again.");
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

// Function to create a bar chart
function createLineChart(containerId, labels, data, chartTitle) {

    // Destroy the existing chart if it exists
    if (window.myCharts && window.myCharts[containerId]) {
        window.myCharts[containerId].destroy();
    }

    const ctx = document.getElementById(containerId).getContext("2d");
    window.myCharts = window.myCharts || {}; // Initialize object if it doesn't exist
    window.myCharts[containerId] = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: chartTitle,
                    data: data,
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    type: 'category', // Use 'category' scale for x-axis labels
                },
                y: {
                    beginAtZero: true // Start y-axis from zero
                }
            }
        },
    });
}


// Function to create a bar chart
function createBarChart(containerId, labels, data, chartTitle) {

    // Destroy the existing chart if it exists
    if (window.myCharts && window.myCharts[containerId]) {
        window.myCharts[containerId].destroy();
    }

    const ctx = document.getElementById(containerId).getContext("2d");
    window.myCharts = window.myCharts || {}; // Initialize object if it doesn't exist
    window.myCharts[containerId] = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: chartTitle,
                    data: data,
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    type: 'category', // Use 'category' scale for x-axis labels
                },
                y: {
                    beginAtZero: true // Start y-axis from zero
                }
            }
        },
    });
}
