const board = document.querySelector("#board1");
const display = board.getContext("2d");
const displayScore = document.querySelector("#score");
const resetBtn = document.querySelector("#reset");
const gameBoardWidth = board.width;
const gameBoardHeight = board.height;
const boardBackground = "white";
const snakeColor = "green";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;

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
resetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart() {
    run = true;
    displayScore.textContent = score;
    createFood(); // call createFood() first
    drawFood();   // then drawFood()
    nextTick();
}


function nextTick() {
    if (run) {
        setTimeout(function () {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 100);
    } else {
        displayGameOver();
    }
}
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
    // check for collision with walls
    if (head.x < 0 || head.x >= gameBoardWidth || head.y < 0 || head.y >= gameBoardHeight) {
        run = false;
        return;
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

}
function resetGame() {
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        { x: getRandomPosition(), y: getRandomPosition() },

    ];
    gameStart();
}

function getRandomPosition() {
    return Math.floor(Math.random() * (gameBoardWidth / unitSize)) * unitSize;
}