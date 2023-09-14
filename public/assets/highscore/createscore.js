export function createScore(userid, gameid, highscore) {
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
        alert("Score inserted successfully.");
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
