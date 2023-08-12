const express = require('express');
const path = require('path');
const createHttpError = require('http-errors');
const friendsRouter = require('./routers/friends');
const usersRouter = require('./routers/users');
const recordsRouter = require('./routers/records');
const highscoreRouter = require('./routers/2048records')
const scoresRouter = require('./routers/scores');
const settingsRouter = require('./routers/settings');
const chatRouter = require('./routers/chat');
const snakeShopRounter = require('./routers/snakeShop')
const creditRouter = require('./routers/credit');
const eloRouter = require('./routers/elo');
const tetrisSettingsRouter = require('./routers/tetrisSettings');
const tetrisChallengeRouter = require('./routers/tetrisChallenge');

const app = express();
//socket-io
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Room data
const rooms = {};

io.on('connection', (socket) => {
    console.log('a user connected');

    // Handle chat message events
    socket.on('chat message', (msg) => {
        console.log("emitting")
        // Broadcast the received message to all connected clients
        io.emit('chat message', msg);
    });

    // Handle 'create room' events
    socket.on('create room', (data) => {
        // Generate a unique room code
        const roomCode = generateRoomCode();

        // Create a new room
        rooms[roomCode] = {
            type: data.roomType,
            players: [socket.id],
            host: socket.id // Store the socket.id of the client that created the room as the host
        };

        // Join the room
        socket.join(roomCode);

        // Emit a 'room joined' event to the client
        io.to(roomCode).emit('room joined', {
            roomCode,
            players: rooms[roomCode].players,
            isHost: socket.id === rooms[roomCode].host // Include a flag indicating whether or not the client is the host of the room
        });


        // If the room is public, emit a 'public rooms' event to all connected clients
        if (data.roomType === 'public') {
            const publicRooms = getPublicRooms();
            io.emit('public rooms', { publicRooms });
        }
    });

    // Handle 'join room' events
    socket.on('join room', (data) => {
        console.log("handling join room")
        const roomCode = data.roomCode;

        // Check if the room exists
        if (!rooms[roomCode]) {
            // Emit an error event to the client
            socket.emit('error', { message: 'Room not found' });
            return;
        }

        // Add the player to the room
        rooms[roomCode].players.push(socket.id);

        // Join the room
        socket.join(roomCode);

        // Emit a 'room joined' event to all clients in the room
        io.to(roomCode).emit('room joined', {
            roomCode,
            players: rooms[roomCode].players,
            isHost: rooms[roomCode].host // Pass the host property of the room data instead of checking if the current client is the host
        });
    });

    // When a user leaves a room
    socket.on('leave room', () => {
        // Find the room the user is currently in
        const roomCode = Object.keys(rooms).find(code => rooms[code].players.includes(socket.id));
        const room = rooms[roomCode];
        if (room) {
            // Remove the user from the room's player list
            room.players = room.players.filter(player => player !== socket.id);

            // Check if the user leaving is the host
            if (socket.id === room.host) {
                // Assign a new host from among the remaining players
                if (room.players.length > 0) {
                    room.host = room.players[0];
                } else {
                    // If there are no remaining players, delete the room
                    delete rooms[roomCode];
                }
            }

            // Update the player list and host for all remaining players in the room
            io.to(roomCode).emit('update player list', { players: room.players, isHost: room.host });
        }
    });

    // Handle 'play' events
    socket.on('play', () => {
        console.log("Handling play")
        // Get a list of all public rooms
        const publicRooms = getPublicRooms();

        // Check if there are any public rooms available
        if (publicRooms.length > 0) {
            // Choose a random public room
            const randomRoom = publicRooms[Math.floor(Math.random() * publicRooms.length)];

            // Add the player to the room
            rooms[randomRoom.roomCode].players.push(socket.id);

            // Join the room
            socket.join(randomRoom.roomCode);

            // Emit a 'room joined' event to all clients in the room
            io.to(randomRoom.roomCode).emit('room joined', {
                roomCode: randomRoom.roomCode,
                players: rooms[randomRoom.roomCode].players
            });
        } else {
            // No public rooms available, emit an error event to the client
            socket.emit('error', { message: 'No public rooms available' });
        }
    });

    // Handle 'start game' events
    socket.on('start game', (data) => {
        console.log("handling start");
        const roomCode = data.roomCode;

        // Initialize the game state for the room
        rooms[roomCode].gameState = {
            food: { x: 0, y: 0 },
            players: {},
            powerUps: [],
            timeRemaining: 3 * 60 // 10 minutes in seconds
        };

        // Start the countdown timer
        const timerId = setInterval(() => {
            // Decrement the remaining time
            rooms[roomCode].gameState.timeRemaining--;

            // Broadcast the updated time remaining to all clients in the room
            io.to(roomCode).emit('time remaining', { timeRemaining: rooms[roomCode].gameState.timeRemaining });

            // Check if the time has run out
            if (rooms[roomCode].gameState.timeRemaining === 0) {
                // Stop the countdown timer
                clearInterval(timerId);

                // End the game
                endGame(roomCode);
            }
        }, 1000); // Update the timer every second


        // Initialize the game state for each player
        let i = 0;
        for (const playerId of rooms[roomCode].players) {
            // Choose a random color for the player's snake
            const colors = ['cyan', 'chartreuse', 'gold', 'magenta', 'paleturquoise', 'burlywood'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            rooms[roomCode].gameState.players[playerId] = {
                // Initialize the position, direction, score, and color for each player
                position: [{ x: i * unitSize, y: 0 }],
                direction: 'right',
                score: 0,
                color: randomColor
            };
            i += 3;
        }

        // Start the game loop for the room
        startGameLoop(roomCode);

        // Start the power-up loop for the room
        startPowerUpLoop(roomCode);

        // Emit a 'start game' event to all clients in the room
        io.to(roomCode).emit('start game', { roomCode });
    });


    // Handle 'change direction' events
    socket.on('change direction', (data) => {
        const roomCode = data.roomCode;
        const newDirection = data.newDirection;

        // Update the direction of the player's snake
        rooms[roomCode].gameState.players[socket.id].direction = newDirection;
    });

    // Handle 'speed up' events
    socket.on('speed up', (data) => {
        const roomCode = data.roomCode;
        const playerId = data.playerId;

        // Set a flag to indicate that the player's snake should move faster
        rooms[roomCode].gameState.players[playerId].isSpeedingUp = true;
    });

    // Handle 'slow down' events
    socket.on('slow down', (data) => {
        const roomCode = data.roomCode;
        const playerId = data.playerId;

        // Clear the flag to indicate that the player's snake should move at normal speed
        rooms[roomCode].gameState.players[playerId].isSpeedingUp = false;
    });

});

// codes for multiplayer snake game
const gameBoardWidth = 1400;
const gameBoardHeight = 600;
const unitSize = 25;

function startGameLoop(roomCode) {
    // Start a separate game loop for each player
    for (const playerId in rooms[roomCode].gameState.players) {
        let intervalId;
        let currentInterval;

        // Update the game loop interval based on the player's isSpeedingUp flag
        const updateInterval = () => {
            const player = rooms[roomCode].gameState.players[playerId];
            if (player) {
                const newInterval = player.isSpeedingUp ? 10 : 100; // Use a shorter interval if the player's isSpeedingUp flag is true

                if (newInterval !== currentInterval) {
                    clearInterval(intervalId);
                    intervalId = setInterval(() => {
                        // Check if the game is over
                        if (rooms[roomCode].gameState.gameOver) {
                            // Stop the game loop if the game is over
                            clearInterval(intervalId);
                            return;
                        }

                        // Update the game state for the specified player
                        updateGameState(roomCode, playerId);

                        // Broadcast the updated game state to all players in the room
                        io.to(roomCode).emit('game state', rooms[roomCode].gameState);
                    }, newInterval);
                    currentInterval = newInterval;
                }
            }
        };

        updateInterval();

        // Periodically check for changes to the player's isSpeedingUp flag
        setInterval(updateInterval, 100);
    }
}

function updateGameState(roomCode, playerId) {

    if (rooms[roomCode].gameState.gameOver) {
        // Don't update the game state if the game is over
        return;
    }


    const player = rooms[roomCode].gameState.players[playerId];
    if (player) {
        // Check if the player is stunned
        if (player.isStunned) {
            // Don't update the game state for stunned players
            return;
        }

        // Check for collision with power-ups
        checkPowerUpCollision(roomCode, playerId);

        // Calculate the new head position based on the current direction
        let newHead;
        switch (player.direction) {
            case 'left':
                newHead = { x: player.position[0].x - unitSize, y: player.position[0].y };
                break;
            case 'up':
                newHead = { x: player.position[0].x, y: player.position[0].y - unitSize };
                break;
            case 'right':
                newHead = { x: player.position[0].x + unitSize, y: player.position[0].y };
                break;
            case 'down':
                newHead = { x: player.position[0].x, y: player.position[0].y + unitSize };
                break;
        }

        // Check for collision with walls
        if (newHead.x < 0) {
            newHead.x = gameBoardWidth - unitSize;
        } else if (newHead.x >= gameBoardWidth) {
            newHead.x = 0;
        } else if (newHead.y < 0) {
            newHead.y = gameBoardHeight - unitSize;
        } else if (newHead.y >= gameBoardHeight) {
            newHead.y = 0;
        }

        // Check for collision with other snakes
        if (!player.isInvincible) {
            for (const otherPlayerId in rooms[roomCode].gameState.players) {
                if (otherPlayerId !== playerId) {
                    const otherPlayer = rooms[roomCode].gameState.players[otherPlayerId];
                    for (const segment of otherPlayer.position) {
                        if (newHead.x === segment.x && newHead.y === segment.y) {
                            // Handle collision with other snake
                            handleGameOver(roomCode, playerId);
                            return;
                        }
                    }
                }
            }
        }

        // Add the new head to the front of the snake
        player.position.unshift(newHead);

        // Check if the snake has eaten the food
        if (player.position[0].x === rooms[roomCode].gameState.food.x && player.position[0].y === rooms[roomCode].gameState.food.y) {
            // Increase the player's score
            player.score++;

            // Generate new food
            let newFood;
            do {
                // Choose a random position on the game board
                newFood = {
                    x: Math.floor(Math.random() * (gameBoardWidth / unitSize)) * unitSize,
                    y: Math.floor(Math.random() * (gameBoardHeight / unitSize)) * unitSize
                };
                console.log(`newFood: ${JSON.stringify(newFood)}`); // Log the new food position
            } while (isFoodOnSnake(roomCode, newFood)); // Repeat until the new food position is not on any player's snake

            // Update the food position in the game state
            rooms[roomCode].gameState.food = newFood;
        } else {
            // Remove the last segment of the snake
            player.position.pop();
        }
    }
}

function handleGameOver(roomCode, playerId) {
    // Remove the player from the room
    rooms[roomCode].players = rooms[roomCode].players.filter((id) => id !== playerId);

    // Remove the player's state from the game state
    delete rooms[roomCode].gameState.players[playerId];

    // Emit a 'game over' event to the specified client
    io.to(playerId).emit('game over', true);

    checkForWinner(roomCode)
}

function checkForWinner(roomCode) {
    // Check if there is only one player left in the room
    if (rooms[roomCode].players.length === 1) {
        console.log(`Emitting game won event to player ${rooms[roomCode].players[0]}`);
        // Emit a 'game won' event to the last remaining player
        io.to(rooms[roomCode].players[0]).emit('game won');
    }
}

function endGame(roomCode) {

    // Set the gameOver flag in the room's game state
    rooms[roomCode].gameState.gameOver = true;

    // Stop the game loop
    clearInterval(rooms[roomCode].gameLoopIntervalId);

    // Emit a 'times up' event to all clients in the room
    io.to(roomCode).emit('times up');

    // Prepare the leaderboard data
    const leaderboardData = {
        players: []
    };
    let playerNumber = 1;
    for (const playerId in rooms[roomCode].gameState.players) {
        const player = rooms[roomCode].gameState.players[playerId];
        leaderboardData.players.push({
            name: `Player ${playerNumber}`,
            score: player.score
        });
        playerNumber++;
    }
    console.log("leaderboard ", leaderboardData)
    // Sort the players by score in descending order
    leaderboardData.players.sort((a, b) => b.score - a.score);

    // Emit a 'leaderboard' event to all clients in the room
    io.to(roomCode).emit('leaderboard', leaderboardData);
}

// Helper function to check if a given position is on any player's snake
function isFoodOnSnake(roomCode, food) {
    console.log("3");
    for (const playerId in rooms[roomCode].gameState.players) {
        const player = rooms[roomCode].gameState.players[playerId];
        for (const segment of player.position) {
            if (segment.x === food.x && segment.y === food.y) {
                console.log(`food is on player ${playerId}'s snake`); // Log if the food is on a player's snake
                return true;
            }
        }
    }
    return false;
}
// Generate power-ups
function startPowerUpLoop(roomCode) {
    setInterval(() => {
        // Choose a random power-up type
        const powerUpTypes = ['stun', 'doubleScore', 'ghost'];
        const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];

        // Generate a new power-up at a random position
        const newPowerUp = {
            type: randomType,
            x: Math.floor(Math.random() * (gameBoardWidth / unitSize)) * unitSize,
            y: Math.floor(Math.random() * (gameBoardHeight / unitSize)) * unitSize
        };

        // Add the new power-up to the game state
        rooms[roomCode].gameState.powerUps.push(newPowerUp);
    }, 15000); // Generate a new power-up every 10 seconds
}

// Collision detection for power-ups
function checkPowerUpCollision(roomCode, playerId) {
    const player = rooms[roomCode].gameState.players[playerId];

    // Check for collision with power-ups
    for (const powerUp of rooms[roomCode].gameState.powerUps) {
        if (player.position[0].x === powerUp.x && player.position[0].y === powerUp.y) {
            // Handle collision with power-up
            handlePowerUp(roomCode, playerId, powerUp);
        }
    }
}

// Handle power-up effects
function handlePowerUp(roomCode, playerId, powerUp) {
    switch (powerUp.type) {
        case 'stun':
            // Stun all other players for 3 seconds
            for (const otherPlayerId in rooms[roomCode].gameState.players) {
                if (otherPlayerId !== playerId) {
                    rooms[roomCode].gameState.players[otherPlayerId].isStunned = true;
                    setTimeout(() => {
                        rooms[roomCode].gameState.players[otherPlayerId].isStunned = false;
                    }, 3000);
                }
            }
            break;
        case 'doubleScore':
            // Double the player's score
            rooms[roomCode].gameState.players[playerId].score *= 2;
            break;
        case 'invincibility':
            // Set a flag to indicate that the player's snake is invincible for 5 seconds
            rooms[roomCode].gameState.players[playerId].isInvincible = true;
            setTimeout(() => {
                rooms[roomCode].gameState.players[playerId].isInvincible = false;
            }, 6000);
            break;
    }

    // Remove the collected power-up from the game state
    rooms[roomCode].gameState.powerUps = rooms[roomCode].gameState.powerUps.filter((p) => p !== powerUp);
}

// Helper function to generate a unique room code
function generateRoomCode() {
    let roomCode = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 6; i++) {
        roomCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return roomCode;
}

// Helper function to get all public rooms
function getPublicRooms() {
    return Object.entries(rooms)
        .filter(([roomCode, roomData]) => roomData.type === 'public')
        .map(([roomCode, roomData]) => ({ roomCode, players: roomData.players }));
}


app.use(express.json()); // to process JSON in request body
app.use(express.static("public"));

app.use('/api/friends', friendsRouter);
app.use('/api/user', friendsRouter);
app.use('/api/messages', chatRouter);




app.use('/api/snakeShop', snakeShopRounter);



//linking to records 
//choi loon said that this is just a route to the router when using the router it would add things like /:userid/:gamerid making this the link 

app.use('/api/highscore', recordsRouter);

app.use('/api/tetrisSettings', tetrisSettingsRouter);
app.use('/api/tetrisChallenge', tetrisChallengeRouter);


app.use('/api/records', scoresRouter);



app.use('/api/update', usersRouter);
// POST /api/register
app.use("/api/register", usersRouter); // for registering
app.use("/", usersRouter); // for delete
app.use("/api/login", usersRouter); // for login

app.use("/api/register", usersRouter);
app.use("/api/delete", usersRouter);
app.use("/api/login", usersRouter);
app.use("/api/profile", usersRouter);
app.use("/api/update", usersRouter);

app.use("/api/users", usersRouter);

app.use("/api/settings", settingsRouter);
app.use("/api/2048records", highscoreRouter);



app.use('/api', creditRouter)
app.use('/api', eloRouter)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/main.html'));
});

app.use((req, res, next) =>
    next(
        createHttpError(404, `Resource ${req.method} ${req.originalUrl} Not Found`)
    )
);

// Error handler
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
    console.log(err);
    return res
        .status(err.status || 500)
        .json({ error: err.message || "Unknown Server Error!" });
});

module.exports = http;
