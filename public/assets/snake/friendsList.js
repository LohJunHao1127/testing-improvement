const gameId = +localStorage.getItem('gameid');
const userId = +localStorage.getItem('userid');

function displayGameHistory(modulesBody, highscore) {
    // Clear any existing content
    modulesBody.innerHTML = "";

    // Create a new list item element
    const listItem = document.createElement("li");

    // Create a paragraph element for the score
    const scoreParagraph = document.createElement("p");
    scoreParagraph.textContent = `Score 1: ${highscore}`;

    // Append the score paragraph to the list item
    listItem.appendChild(scoreParagraph);

    // Append the list item to the game history list
    modulesBody.appendChild(listItem);
}

function displayFriendList(modulesBody, friendsRequests) {
    const friendsList = document.getElementById("friends-requests-list");

    // Clear the existing content
    modulesBody.innerHTML = "";

    // Create a table
    const table = document.createElement("table");
    friendsList.appendChild(table);

    // Create a table row for each friend request
    friendsRequests.forEach((request) => {
        const tr = document.createElement("tr");
        table.appendChild(tr);

        // Create a cell for the username
        const usernameCell = document.createElement("td");
        usernameCell.textContent = request.username;
        tr.appendChild(usernameCell);


    });
}

function displayReceivedList(modulesBody, receivedRequests) {
    // Clear the existing list
    modulesBody.innerHTML = "";

    // Create a table element
    const table = document.createElement("table");

    // Create a new table row for each received request
    receivedRequests.forEach((request) => {
        const tr = document.createElement("tr");

        // Create a table cell to display the username
        const usernameTd = document.createElement("td");
        usernameTd.innerText = `${request.username}`;
        usernameTd.style.width = "100%";


        // Create a table cell for the accept button
        const acceptTd = document.createElement("td");
        acceptTd.style.textAlign = "right";

        // Create a tick button to accept the request
        const acceptButton = document.createElement("button");
        acceptButton.innerText = "✔️";
        acceptButton.classList.add("accept-button");
        const id = +`${request.id}`

        // Add event listener to accept button
        acceptButton.addEventListener("click", (request) => {
            acceptRequest(id, acceptButton, tr);
        });

        // Append the accept button to the acceptTd
        acceptTd.appendChild(acceptButton);

        // Create a table cell for the reject button
        const rejectTd = document.createElement("td");
        rejectTd.style.textAlign = "right";

        // Create a reject button to reject the request
        const rejectButton = document.createElement("button");
        rejectButton.innerText = "❌";
        rejectButton.classList.add("reject-button");

        // Add event listener to reject button
        rejectButton.addEventListener("click", (request) => {
            rejectRequest(id, rejectButton, tr);
        });

        // Append the reject button to the rejectTd
        rejectTd.appendChild(rejectButton);

        // Append the usernameTd, acceptTd, and rejectTd to the tr
        tr.appendChild(usernameTd);
        tr.appendChild(acceptTd);
        tr.appendChild(rejectTd);

        // Append the tr to the table
        table.appendChild(tr);
    });

    // Append the table to the modules body
    modulesBody.appendChild(table);
}

function displaySentList(modulesBody, sentRequests) {
    // Clear the existing list
    modulesBody.innerHTML = "";
    console.log(sentRequests);

    // Create a table element
    const table = document.createElement("table");

    // Create a new table row for each sent request
    sentRequests.forEach((request) => {
        const tr = document.createElement("tr");

        // Create a table cell to display the request details
        const requestDetailsTd = document.createElement("td");
        requestDetailsTd.innerText = `${request.username}`;
        requestDetailsTd.style.width = "100%";

        // Create a table cell for the cancel button
        const cancelTd = document.createElement("td");
        cancelTd.style.textAlign = "right";

        // Create a cancel button
        const cancelButton = document.createElement("button");
        cancelButton.innerText = "Cancel";
        cancelButton.classList.add("cancel-button");

        // Add event listener to cancel button
        const sentRequest = +`${request.sent_request}`
        const receivedRequest = +`${request.received_request}`
        cancelButton.addEventListener("click", () => {
            cancelRequest(sentRequest, receivedRequest, gameId, cancelButton, tr);
        });

        // Append the cancel button to the cancelTd
        cancelTd.appendChild(cancelButton);

        // Append the requestDetailsTd and cancelTd to the tr
        tr.appendChild(requestDetailsTd);
        tr.appendChild(cancelTd);

        // Append the tr to the table
        table.appendChild(tr);
    });

    // Append the table to the modules body
    modulesBody.appendChild(table);
}

function acceptRequest(id, acceptButton, listItem) {
    const originalValue = acceptButton.textContent;
    acceptButton.textContent = "loading...";
    acceptButton.disabled = true;
    fetch(`/api/friends/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "Accepted" }),
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => {
            if (response.ok) {
                return console.log("added");
            }
            return response.json().then((body) => {
                throw new Error(body.error || "Error occurred"); // Throw an error with the error message from the response
            });
        })
        .then(() => {
            alert("Success!");
        })
        .catch((error) => {
            alert(error.message);
        })
        .finally(() => {
            listItem.remove();
        });

}
function rejectRequest(id, rejectButton, listItem) {
    console.log("Num " + id)
    const originalValue = rejectButton.textContent;
    rejectButton.textContent = "loading...";
    rejectButton.disabled = true;
    fetch(`/api/friends/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "Rejected" }),
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => {
            if (response.ok) {
                return console.log("changed");
            }
            return response.json().then((body) => {
                throw new Error(body.error || "Error occurred"); // Throw an error with the error message from the response
            });
        })
        .then(() => {
            alert("Success!");
        })
        .catch((error) => {
            alert(error.message);
        })
        .finally(() => {
            listItem.remove();
        });

}
function cancelRequest(sentRequest, receivedRequest, gameId, cancelButton, tr) {
    cancelButton.textContent = "loading...";
    cancelButton.disabled = true;

    fetch(`/api/friends/${sentRequest}/${receivedRequest}/${gameId}`, {
        method: "DELETE",
    })
        .then((response) => {
            if (response.ok) {
                return {};
            }
            throw new Error("Request failed: " + response.status);
        })
        .then((body) => {
            if (body.error) {
                alert(body.error);
            } else {
                alert("Success!");
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            alert("Error occurred while fetching data");
        })
        .finally(() => {
            tr.remove();
        });
}
function searchResult(modulesBody, searchResult) {
    // Clear the search results
    modulesBody.innerHTML = "";

    // If there are no search results, display a message
    if (!searchResult || searchResult.length === 0) {
        modulesBody.innerHTML = "<p>No results found</p>";
        return;
    }

    // Create a table element
    const table = document.createElement("table");

    // Loop through each search result and create a table row with the username and a request button
    searchResult.forEach((result) => {
        const tr = document.createElement("tr");

        // Create a table cell to display the username
        const usernameTd = document.createElement("td");
        usernameTd.textContent = `${result.username}`;
        usernameTd.style.width = "100%";


        // Create a table cell for the request button
        const requestTd = document.createElement("td");
        requestTd.style.textAlign = "right";

        //for request button
        const requestButton = document.createElement("button");
        requestButton.textContent = "Request";
        requestButton.addEventListener("click", (event) => {
            event.preventDefault();
            requestButton.disabled = true;
            const id = `${result.userid}`
            //2 Send http request to fetch data
            fetch(`/api/friends`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    gameid: gameId,
                    received_request: userId,//need to check login
                    sent_request: +id,
                }),
            })
                .then((response) => {
                    return response.json();
                })
                .then((body) => {
                    if (body.error) {
                        return alert(body.error);
                    }
                    //4
                    requestButton.disabled = true;
                    requestButton.textContent = "Requested";
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                })
        });

        // Append the request button to the requestTd
        requestTd.appendChild(requestButton);

        // Append the usernameTd and requestTd to the tr
        tr.appendChild(usernameTd);
        tr.appendChild(requestTd);

        // Append the tr to the table
        table.appendChild(tr);
    });

    // Append the table to the modules body
    modulesBody.appendChild(table);
}

window.addEventListener("DOMContentLoaded", () => {

    //  Friends tab
    const friendsBody = document.getElementById("friends-requests-list");
    const friendsRequestsTab = document.getElementById("received-requests-tab");

    function handleFriendsRequestsTabClick() {
        friendsRequestsTab.classList.add("disabled");
        fetch(`/api/friends?gameid=${gameId}&userid=${userId}&type=friends`)
            .then((response) => response.json())
            .then((body) => {
                if (body.error) {
                    return alert(body.error);
                }
                return displayFriendList(friendsBody, body.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                friendsRequestsTab.classList.remove("disabled");
            });
    }

    /* ------------------------------------------------------------------- */
    //  Game history
    const gameHistory = document.getElementById("game-history-list");
    function fetchGameHistory() {
        fetch(`/api/highscore/${userId}/${gameId}`)
            .then((response) => response.json())
            .then((body) => {
                if (body.error) {
                    return alert(body.error);
                }

                return displayGameHistory(gameHistory, body.highscore);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }
    /* -------------------------------------------------------------------------------- */

    //  Received request tab
    const receivedFriendsBody = document.getElementById("received-requests-list");
    const receivedRequestsTab = document.querySelector("#received-requests-tab");
    receivedRequestsTab.addEventListener("click", (event) => {

        event.preventDefault();
        receivedRequestsTab.disabled = true;

        //2 Send http request to fetch data

        fetch(`/api/friends?gameid=${gameId}&userid=${userId}&type=received`)
            .then((response) => {
                return response.json();
            })
            .then((body) => {
                if (body.error) {
                    return alert(body.error);
                }
                //4
                return displayReceivedList(receivedFriendsBody, body.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                receivedRequestsTab.disabled = false;
            });
    });
    /* ------------------------------------------------------------------------------------------------- */

    //  Sent request tab
    const sentFriendsBody = document.getElementById("sent-requests-list");
    const sentRequestsTab = document.querySelector("#sent-requests-tab");
    sentRequestsTab.addEventListener("click", (event) => {
        event.preventDefault();
        sentRequestsTab.disabled = true;

        //2 Send http request to fetch data
        fetch(`/api/friends?gameid=${gameId}&userid=${userId}&type=sent`)
            .then((response) => {

                return response.json();
            })
            .then((body) => {
                if (body.error) {
                    return alert(body.error);
                }
                //4
                return displaySentList(sentFriendsBody, body.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                sentRequestsTab.disabled = false;
            });
    });

    /* ----------------------------------------------------------------------------- */
    // search friends tab
    const searchBody = document.getElementById("search-results");
    const searchButton = document.getElementById("search-button");
    searchButton.addEventListener("click", (event) => {
        event.preventDefault();
        const username = document.getElementById("search-input").value;

        //   validate
        if (!username) {
            alert("Please enter a valid input");
            return;
        }
        searchButton.disabled = true;
        console.log("Before fetching")
        //2 Send http request to fetch data
        fetch(`/api/user/${username}`)
            .then((response) => {
                return response.json();
            })
            .then((body) => {
                if (body.error) {
                    return alert(body.error);
                }
                //4
                return searchResult(searchBody, body.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                searchButton.disabled = false;
            });
    });

    /* ----------------------------------------------------------------------------- */

    Promise.all([fetchGameHistory(), handleFriendsRequestsTabClick()]);


    if (friendsRequestsTab) {
        friendsRequestsTab.addEventListener("click", handleFriendsRequestsTabClick);
        handleFriendsRequestsTabClick(); // Trigger the click event automatically
    }
});




