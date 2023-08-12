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
var stunX;
var stunY;
var doubleScoreX;
var doubleScoreY;
var stunTimeRemaining = 0;
var powerUpTimeRemaining = 15000;

let snake = [
    { x: unitSize * 4, y: 0 },

];
// Add new variables to define the enemies and their movement
const enemies = [
    { x: 200, y: 200, xVelocity: unitSize, yVelocity: 0 },
    { x: 400, y: 400, xVelocity: -unitSize, yVelocity: 0 },
];
var enemyMoveInterval = null;


window.addEventListener("keydown", changeDirection);
//resetBtn.addEventListener("click", resetGame);


gameStart();

// Modify the gameStart function to call the moveEnemies function more frequently
function gameStart() {
    run = true;
    displayScore.textContent = score;
    createFood();
    drawFood();
    nextTick();

    // Start moving the enemies more frequently
    enemyMoveInterval = setInterval(moveEnemies, 180);
}


function createStun() {
    stunX = Math.floor(Math.random() * (gameBoardWidth / unitSize)) * unitSize;
    stunY = Math.floor(Math.random() * (gameBoardHeight / unitSize)) * unitSize;
}

function drawStun() {
    display.fillStyle = "blue";
    display.fillRect(stunX, stunY, unitSize, unitSize);
}


// Modify the moveEnemies function to move the enemies in larger increments
function moveEnemies() {
    if (stunTimeRemaining <= 0) {
        enemies.forEach(enemy => {
            if (enemy.x < snake[0].x) {
                enemy.x += unitSize;
            } else if (enemy.x > snake[0].x) {
                enemy.x -= unitSize;
            }

            if (enemy.y < snake[0].y) {
                enemy.y += unitSize;
            } else if (enemy.y > snake[0].y) {
                enemy.y -= unitSize;
            }
        });
    } else {
        stunTimeRemaining -= 200;
    }
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

            // Decrement the power-up timer and generate a new power-up if it reaches 0
            powerUpTimeRemaining -= timeout;
            if (powerUpTimeRemaining <= 0) {
                // Reset the power-up timer
                powerUpTimeRemaining = 15000;
                createStun();

            }

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

    // Draw the enemies in red
    display.fillStyle = "black";
    enemies.forEach(enemy => {
        display.fillRect(enemy.x, enemy.y, unitSize, unitSize);
    });

    // Only draw the stun power-up if its coordinates are defined
    if (stunX !== undefined && stunY !== undefined) {
        drawStun();
    }

    // Only draw the double score power-up if its coordinates are defined
    if (doubleScoreX !== undefined && doubleScoreY !== undefined) {
        drawDoubleScore();
    }
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

    // Check for collision with the enemies
    const hitEnemyIndex = enemies.findIndex(enemy => {
        return (
            head.x < enemy.x + unitSize &&
            head.x + unitSize > enemy.x &&
            head.y < enemy.y + unitSize &&
            head.y + unitSize > enemy.y
        );
    });

    if (hitEnemyIndex !== -1) {
        score = Math.max(0, score - 1);
        displayScore.textContent = score;
        enemies.splice(hitEnemyIndex, 1);
    }

    // Add more enemies as the snake gets longer
    if (snake.length % 4 === 0 && enemies.length < snake.length / 4 + 2) {
        enemies.push({ x: Math.random() * gameBoardWidth, y: Math.random() * gameBoardHeight, xVelocity: unitSize, yVelocity: 0 });
    }

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

    // Check if the snake has collided with the stun power-up
    if (snake[0].x == stunX && snake[0].y == stunY) {
        // Apply the stun effect to all enemies
        stunTimeRemaining = 2000;

        // Reset the coordinates of the stun power-up
        stunX = undefined;
        stunY = undefined;
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
        insertsScore(score);
    }
    catch (error) {
        console.log(error);
        return;
    }

}


function getRandomPosition() {
    return Math.floor(Math.random() * (gameBoardWidth / unitSize)) * unitSize;
}

function insertsScore(score) {
    fetch('/api/snakeShop', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            score: score,
            userid: userId
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
