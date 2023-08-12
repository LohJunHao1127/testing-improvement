const gameId = +localStorage.getItem('gameid');
const userId = +localStorage.getItem('userid');

const board = document.querySelector("#board1");
const display = board.getContext("2d");
const displayScore = document.querySelector("#score");
const highScoreElement = document.querySelector("#highest-score");
const resetBtn = document.querySelector("#reset");
const gameBoardWidth = board.width;
const gameBoardHeight = board.height;
const boardBackground = "white";
const snakeColor = "green";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;

// Add a new variable to keep track of whether the spacebar is pressed
var spacePressed = false;
var run = false;
var xVelocity = unitSize;
var yVelocity = 0;
var foodX;
var foodY;
var score = 0;
let snake = [
    { x: unitSize * 4, y: 0 },

];

window.addEventListener("keydown", changeDirection);
//resetBtn.addEventListener("click", resetGame);


Promise.all([gameStart(), retrieveHighscore()])
    .catch((error) => {
        // handle errors
        console.log(error);
    });


function gameStart() {
    run = true;
    displayScore.textContent = score;
    createFood(); // call createFood() first
    drawFood();   // then drawFood()
    nextTick();
}


function nextTick() {
    if (run) {
        // Set a shorter timeout if the spacebar is pressed
        const timeout = spacePressed ? 25 : 100;

        setTimeout(function () {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, timeout);
    } else {
        displayGameOver();
    }
}

// Add an event listener for keydown events to detect when the spacebar is pressed
window.addEventListener("keydown", event => {
    if (event.code === "Space") {
        spacePressed = true;
    }
});

// Add an event listener for keyup events to detect when the spacebar is released
window.addEventListener("keyup", event => {
    if (event.code === "Space") {
        spacePressed = false;
    }
});
function clearBoard() {
    display.fillStyle = boardBackground;
    display.fillRect(0, 0, gameBoardWidth, gameBoardHeight);
}
function createFood() {
    // Generate a random number between 0 and the max number of food locations horizontally and vertically
    let foodX = Math.floor(Math.random() * (gameBoardWidth / unitSize)) * unitSize;
    let foodY = Math.floor(Math.random() * (gameBoardHeight / unitSize)) * unitSize;

    // Check if the new food location is the same as any part of the snake's body
    const isFoodOnSnake = snake.some(snakePart => {
        return snakePart.x === foodX && snakePart.y === foodY;
    });

    // If the new food location is on the snake, generate a new location recursively
    if (isFoodOnSnake) {
        return createFood();
    }

    // If the new food location is not on the snake, set the global variables for food location
    foodXGlobal = foodX;
    foodYGlobal = foodY;
}


function drawFood() {
    display.fillStyle = foodColor;
    display.fillRect(foodXGlobal, foodYGlobal, unitSize, unitSize);
}

function moveSnake() {
    const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };

    // Wrap the snake around if it goes off the edge of the board
    if (head.x < 0) {
        head.x = gameBoardWidth - unitSize;
    } else if (head.x >= gameBoardWidth) {
        head.x = 0;
    }

    if (head.y < 0) {
        head.y = gameBoardHeight - unitSize;
    } else if (head.y >= gameBoardHeight) {
        head.y = 0;
    }

    snake.unshift(head);

    //if food is eaten
    if (snake[0].x == foodXGlobal && snake[0].y == foodYGlobal) {
        score += 1;
        displayScore.textContent = score;
        createFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    display.fillStyle = snakeColor;
    display.strokeStyle = snakeBorder;
    snake.forEach((snakePart) => {
        display.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        display.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    });
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = yVelocity == -unitSize;
    const goingDown = yVelocity == unitSize;
    const goingRight = xVelocity == unitSize;
    const goingLeft = xVelocity == -unitSize;

    switch (true) {
        case (keyPressed == LEFT && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case (keyPressed == UP && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case (keyPressed == RIGHT && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case (keyPressed == DOWN && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
}
function checkGameOver() {
    switch (true) {
        case (snake[0].x < 0):
            run = false;
            break;
        case (snake[0].x >= gameBoardWidth):
            run = false;
            break;
        case (snake[0].y < 0):
            run = false;
            break;
        case (snake[0].y >= gameBoardHeight):
            run = false;
            break;

    }
    for (var i = 1; i < snake.length; i++) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            run = false;
        }
    }
}
function displayGameOver() {
    display.font = "50px MV Boli";
    display.fillStyle = "black";
    display.textAlign = "center"
    display.fillText("GAME OVER!", gameBoardWidth / 2, gameBoardHeight / 2)
    run = false;

    try {
        createScore(userId, gameId, score);
    } catch (error) {
        console.log(error);
        return;
    }

}


function getRandomPosition() {
    return Math.floor(Math.random() * (gameBoardWidth / unitSize)) * unitSize;
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

function retrieveHighscore() {

    if (isNaN(userId) || isNaN(gameId)) {
        alert("Please go back to main.html and try again");
        return;
    }

    // Construct the URL with query parameters
    const url = `/api/highscore/getHighscore/${userId}/${gameId}`;

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
                // Update the high score element in the HTML
                console.log(data.highscore);
                highScoreElement.textContent = data.highscore;
            } else {
                console.log("failed to retrieve score")
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            // Log additional information about the error
            console.log("Error status:", error.status);
            console.log("Error message:", error.message);
        });


}