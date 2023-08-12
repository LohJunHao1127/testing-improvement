const gameId = +localStorage.getItem('gameid');
const userId = +localStorage.getItem('userid');

function displayGameHistory(modulesBody, result) {
    // Clear any existing content
    modulesBody.innerHTML = "";

    // Create a table
    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";
    modulesBody.appendChild(table);

    // Create a table row for each game history item
    result[0].forEach((item, index) => {
        const tr = document.createElement("tr");
        table.appendChild(tr);

        // Create a cell for the game number
        const gameCell = document.createElement("td");
        gameCell.textContent = `Game ${index + 1}`;
        gameCell.style.textAlign = "left";
        gameCell.style.padding = "8px";
        tr.appendChild(gameCell);

        // Create a cell for the score
        const scoreCell = document.createElement("td");
        scoreCell.textContent = "Score: " + item.score;
        scoreCell.style.textAlign = "left";
        scoreCell.style.padding = "8px";
        tr.appendChild(scoreCell);

        // Extract the timestamp
        const timestamp = item.timestamp;

        // Replace the space with a 'T' to make it ISO 8601 compliant
        const isoTimestamp = timestamp.replace(' ', 'T');

        // Create a Date object from the timestamp
        const date = new Date(isoTimestamp);

        // Set the timezoneOffset variable to the difference between your local timezone and the database server's timezone in hours
        const timezoneOffset = 8;

        // Add the timezone offset to the Date object
        date.setHours(date.getHours() + timezoneOffset);

        // Extract the individual components of the time
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        // Format the time as a string in 24-hour format
        const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Create a cell for the time
        const timeCell = document.createElement("td");
        timeCell.textContent = time;
        timeCell.style.textAlign = "left";
        timeCell.style.padding = "8px";
        tr.appendChild(timeCell);

    });
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
function displayChatList(modulesBody, chats, selectedUser = null) {
    console.log(" to userId: " + modulesBody.userid);
    const chatList = document.getElementById("chat-list");

    // Clear the existing content
    modulesBody.innerHTML = "";

    if (selectedUser) {
        console.log("From user id: " + userId + " to userId: ", selectedUser.userid);
        // Display the chat history with the selected user
        const chatItem = document.createElement("li");
        chatItem.classList.add("chat-item");
        chatList.appendChild(chatItem);

        // Create a back button
        const backButton = document.createElement("i");
        backButton.classList.add("fas", "fa-arrow-left"); // Add Font Awesome classes to display the desired icon
        backButton.addEventListener("click", () => {
            // Re-render the chat list to display the chat list
            displayChatList(modulesBody, chats);
        });
        chatItem.appendChild(backButton);

        // Create a container for the user avatar and name
        const userContainer = document.createElement("div");
        userContainer.classList.add("user-container");
        chatItem.appendChild(userContainer);

        // Create an element for the user avatar
        const userAvatar = document.createElement("img");
        userAvatar.classList.add("user-avatar");
        userAvatar.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLt0x6sP1iV1ROmpHYsliaw9EAobS1A6od-7EZuLQ&s"//selectedUser.avatarUrl;
        userContainer.appendChild(userAvatar);

        // Create a container for the username and status
        const userInfoContainer = document.createElement("div");
        userInfoContainer.classList.add("user-info-container");
        userContainer.appendChild(userInfoContainer);

        // Create an element for the username
        const username = document.createElement("div");
        username.classList.add("username");
        username.textContent = selectedUser.username;
        userInfoContainer.appendChild(username);

        // Create an element for the status
        const status = document.createElement("div");
        status.classList.add("status");
        status.textContent = selectedUser.availability;
        userInfoContainer.appendChild(status);

        //space for text messages
        const messagesContainer = document.createElement("div");
        messagesContainer.classList.add("messages-container");
        chatList.appendChild(messagesContainer);

        const inputContainer = document.createElement("div");
        inputContainer.classList.add("input-container");

        // Load the chat history with the selected user
        const socket = io();
        loadChatHistory(selectedUser.userid);
        function loadChatHistory(userid) {
            // Remove any existing event listener for incoming messages
            socket.off('chat message');

            socket.on('chat message', (msg) => {
                // Check if the message is from or to the selected user
                console.log("msg from " + msg.from);
                if (msg.from == userid && msg.to == userId) {
                    // Check if the selected user is the same as the sender of the message
                    if (selectedUser.userid === msg.from) {
                        // Code to update your chat interface with the received message
                        const messagesContainer = document.querySelector("#chat-list .messages-container");
                        const messageItem = document.createElement("li");
                        messageItem.classList.add("message-item", "received-message");
                        messageItem.textContent = msg.text;
                        messagesContainer.appendChild(messageItem);

                        // Scroll to the bottom of the messages-container
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    }
                } else { }
            });
        }



        // Create an input field for typing messages
        const messageInput = document.createElement("input");
        messageInput.type = "text";
        messageInput.placeholder = "Message...";
        inputContainer.appendChild(messageInput);


        //code to insert
        function sendMessage() {
            // Code to send the message typed in the input field
            const message = messageInput.value;
            if (message) {
                socket.emit('chat message', { from: userId, to: selectedUser.userid, text: message });

                // Code to update your chat interface with the sent message
                const messagesContainer = document.querySelector("#chat-list .messages-container");
                const messageItem = document.createElement("li");
                messageItem.classList.add("message-item", "sent-message");
                messageItem.textContent = message;
                messagesContainer.appendChild(messageItem);

                // Scroll to the bottom of the messages-container
                messagesContainer.scrollTop = messagesContainer.scrollHeight;

                // Code to insert the message into the database
                fetch('/api/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        sender: userId,
                        receiver: selectedUser.userid,
                        message: message
                    })
                })
                    .then((response) => response.json())
                    .then((body) => {
                        if (body.error) {
                            return alert(body.error);
                        }
                        console.log('Message inserted into database');
                    })
                    .catch((error) => {
                        console.error('Error inserting message into database:', error);
                    });

            }
            messageInput.value = "";
        }

        // Create a send button for sending messages
        const sendButton = document.createElement("i");
        sendButton.classList.add("fas", "fa-paper-plane"); // Add Font Awesome classes to display the desired icon
        sendButton.addEventListener("click", sendMessage);

        messageInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                sendMessage();
            }
        });

        inputContainer.appendChild(sendButton);
        chatList.appendChild(inputContainer);

    } else {
        // Display the chat list
        chats.forEach((chat) => {
            const chatItem = document.createElement("li");
            chatItem.classList.add("chat-item");
            chatList.appendChild(chatItem);

            // Create a container for the user avatar and name
            const userContainer = document.createElement("div");
            userContainer.classList.add("user-container");
            chatItem.appendChild(userContainer);

            // Create an element for the user avatar
            const userAvatar = document.createElement("img");
            userAvatar.classList.add("user-avatar");
            userAvatar.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLt0x6sP1iV1ROmpHYsliaw9EAobS1A6od-7EZuLQ&s"//chat.avatarUrl;
            userContainer.appendChild(userAvatar);

            // Create a container for the username and status
            const userInfoContainer = document.createElement("div");
            userInfoContainer.classList.add("user-info-container");
            userContainer.appendChild(userInfoContainer);

            // Create an element for the username
            const username = document.createElement("div");
            username.classList.add("username");
            username.textContent = chat.username;
            userInfoContainer.appendChild(username);

            // Create an element for the status
            const status = document.createElement("div");
            status.classList.add("status");
            status.textContent = chat.availability;
            userInfoContainer.appendChild(status);
            console.log("Test : " + chat.userid);
            // Add an event listener to the chat item
            // Add an event listener to the chat item
            chatItem.addEventListener("click", () => {
                // Re-render the chat list to display the chat history with the selected user
                displayChatList(modulesBody, chats, {
                    userid: chat.userid,
                    username: chat.username,
                    avatarUrl: chat.avatarUrl,
                    availability: chat.availability
                });

                fetch(`/api/messages/${chat.userid}/${userId}`)
                    .then(response => response.json())
                    .then((messages) => {
                        // Update the messages-container with the messages
                        const messagesContainer = document.querySelector('.messages-container');

                        // Clear the messages-container before appending new messages
                        messagesContainer.innerHTML = "";

                        messages.data.forEach((message) => {
                            const messageItem = document.createElement('li');
                            messageItem.textContent = message.message;
                            // Add a class to the messageItem based on whether the message was sent or received
                            if (message.sender === userId) {
                                messageItem.classList.add('sent-message');
                            } else {
                                messageItem.classList.add('received-message');
                            }
                            messagesContainer.appendChild(messageItem);

                            // Scroll to the bottom of the messages-container
                            messagesContainer.scrollTop = messagesContainer.scrollHeight;
                        });
                    });
            });

        });
    }
}

/* ---------------------------------------------------------------------------------- */

window.addEventListener("DOMContentLoaded", () => {

    //  Friends tab
    const friendsBody = document.getElementById("friends-requests-list");
    const chatBody = document.getElementById("chat-list");
    const friendsRequestsTab = document.getElementById("received-requests-tab");

    // Friends and chat
    function handleFriendsRequestsTabClick() {
        friendsRequestsTab.classList.add("disabled");
        fetch(`/api/friends?gameid=${gameId}&userid=${userId}&type=friends`)
            .then((response) => response.json())
            .then((body) => {
                if (body.error) {
                    return alert(body.error);
                }
                console.log(body.data);
                displayFriendList(friendsBody, body.data);
                displayChatList(chatBody, body.data);
                return;
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
    const dateInput = document.getElementById("date-input");
    const fetchButton = document.getElementById("fetch-button");

    function fetchGameHistory(date) {
        fetch(`/api/highscore/getAllHighscore/${userId}/${gameId}/${date}`)
            .then((response) => response.json())
            .then((body) => {
                if (body.error) {
                    return alert(body.error);
                }
                console.log("data: ");
                return displayGameHistory(gameHistory, body.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    fetchButton.addEventListener("click", () => {
        const date = dateInput.value;
        fetchGameHistory(date);
    });

    // Set the value of the date input to the current date
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    dateInput.value = `${year}-${month}-${day}`;




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




    /* ----------------------------------------------------------------------------- */

    Promise.all([fetchGameHistory(dateInput.value), handleFriendsRequestsTabClick()]);


    if (friendsRequestsTab) {
        friendsRequestsTab.addEventListener("click", handleFriendsRequestsTabClick);
        handleFriendsRequestsTabClick(); // Trigger the click event automatically
    }
});




