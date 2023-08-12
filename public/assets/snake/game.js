const socket = io();
let roomCode;


// Play button
const playButton = document.querySelector('#play-button');
playButton.addEventListener('click', () => {
    // Emit a 'play' event to the server
    socket.emit('play');

    // Hide the create/join room forms and play button
    roomPage.style.display = 'none';
    joinRoomForm.style.display = 'none';
    playButton.style.display = 'none';

    // Show the waiting lobby
    const waitingLobby = document.querySelector('#waiting-lobby');
    waitingLobby.style.display = 'block'
});

// Create room form
const createRoomForm = document.querySelector('#create-room-form');
const roomPage = document.querySelector('#roomForm');
createRoomForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Get the selected room type
    const roomType = createRoomForm.querySelector('#room-type').value;

    // Emit a 'create room' event to the server
    socket.emit('create room', { roomType });

    // Hide the create/join room forms and play button
    roomPage.style.display = 'none';
    joinRoomForm.style.display = 'none';
    playButton.style.display = 'none';

    // Show the waiting lobby
    const waitingLobby = document.querySelector('#waiting-lobby');
    waitingLobby.style.display = 'block';
});

// Join room form
const joinRoomForm = document.querySelector('#join-room-form');
joinRoomForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Get the entered room code
    const roomCode = joinRoomForm.querySelector('#room-code').value;

    if (!roomCode) {
        return;
    }

    // Emit a 'join room' event to the server
    socket.emit('join room', { roomCode });

    // Hide the create/join room forms and play button
    title.style.display = 'none';
    roomPage.style.display = 'none';
    joinRoomForm.style.display = 'none';
    playButton.style.display = 'none';

    // Show the waiting lobby
    const waitingLobby = document.querySelector('#waiting-lobby');
    waitingLobby.style.display = 'block';
});

const title = document.querySelector('#title');
// Handle 'room joined' events from the server
socket.on('room joined', (data) => {
    // Show the waiting lobby and update the room code and player list
    const waitingLobby = document.querySelector('#waiting-lobby');
    title.style.display = 'none';
    waitingLobby.style.display = 'block';

    const lobbyRoomCode = document.querySelector('#lobby-room-code');
    lobbyRoomCode.textContent = data.roomCode;

    const playerList = document.querySelector('#player-list');
    playerList.classList.add('player-list'); // Add the .player-list class to the ul element
    playerList.innerHTML = '';
    for (let i = 0; i < data.players.length; i++) {
        const playerItem = document.createElement('li');
        playerItem.textContent = `Player ${i + 1}`;
        if (data.players[i] === socket.id) { // Check if the current player is the user
            playerItem.classList.add('user'); // Add the .user class to the li element
        }
        playerList.appendChild(playerItem);
    }

    // Show or hide the start button based on whether or not the client is the host of the room
    const startButton = document.querySelector('#start-button');
    if (socket.id === data.isHost) { // Check if the socket.id of the client is equal to the isHost property received from the server
        startButton.style.display = 'block';
    } else {
        startButton.style.display = 'none';
    }
    roomCode = data.roomCode;
});

// Handle 'update player list' events from the server
socket.on('update player list', (data) => {
    // Update the player list in the waiting lobby
    const playerList = document.querySelector('#player-list');
    playerList.innerHTML = '';
    for (let i = 0; i < data.players.length; i++) {
        const playerItem = document.createElement('li');
        playerItem.textContent = `Player ${i + 1}`;
        if (data.players[i] === socket.id) { // Check if the current player is the user
            playerItem.classList.add('user'); // Add the .user class to the li element
        }
        playerList.appendChild(playerItem);
    }

    // Show or hide the start button based on whether or not the client is now the host of the room and whether or not there are enough players to start the game
    const startButton = document.querySelector('#start-button');
    if (socket.id === data.isHost && data.players.length > 1) { // Check if the socket.id of the client is equal to the isHost property received from the server and if there are more than one players in the room
        startButton.style.display = 'block';
    } else {
        startButton.style.display = 'none';
    }
});


// for start game
const startButton = document.querySelector('#start-button');
startButton.addEventListener('click', () => {
    // Emit a 'start game' event to the server
    socket.emit('start game', { roomCode });
});

const leaveRoomButton = document.querySelector('#leave-room-button');
leaveRoomButton.addEventListener('click', () => {
    // Emit a 'leave room' event to the server
    socket.emit('leave room');
    title.style.display = 'block';
    // Hide the waiting lobby
    const waitingLobby = document.querySelector('#waiting-lobby');
    waitingLobby.style.display = 'none';

    // Show the create/join room forms 
    roomPage.style.display = 'block';
    createRoomForm.style.display = 'flex';
    joinRoomForm.style.display = 'block';
    playButton.style.display = 'block';

});


let gameStarted = false;

socket.on('start game', (data) => {
    console.log("in game.js start");
    if (!gameStarted) {
        gameStarted = true;
        title.style.display = 'none';
        // Create an iframe element and set its src attribute to the URL of the snake.html page
        const iframe = document.createElement('iframe');
        iframe.src = 'snake.html';

        // Add CSS styles to the iframe element
        iframe.style.width = (window.innerWidth - 1) + "px";
        iframe.style.height = (window.innerHeight - 2) + "px";
        iframe.style.overflow = 'auto';
        iframe.style.display = 'block';
        iframe.style.border = 'none';

        // Hide the box element
        const boxElement = document.querySelector('#box');
        boxElement.style.display = 'none';

        // Append the iframe element to the document body
        document.body.appendChild(iframe);
        iframe.onload = function () {
            iframe.contentWindow.runSnakeGame(socket, roomCode);
        }
    }
});





