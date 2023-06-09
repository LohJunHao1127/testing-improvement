// JavaScript code for the game
//importing createScore()
import { createScore } from "../../highscore/createscore.js";
// Constants for block colors
const COLORS = ["cyan", "blue", "orange", "yellow", "lime", "purple", "red"];

// Variables for game state
let board = [];
let currentBlock = {};
let intervalId;
let score = 0;
let shuffledShapes = [];
// Array of shapes
let SHAPES = [
  [[1, 1, 1, 1]], // Straight Block
  [
    [1, 1, 1],
    [0, 0, 1], // J block
  ],
  [
    [1, 1, 1],
    [1, 0, 0], // L block
  ],
  [
    [1, 1],
    [1, 1], // Square block
  ],
  [
    [0, 1, 1],
    [1, 1, 0], // S block
  ],
  [
    [1, 1, 1],
    [0, 1, 0], // T block
  ],
  [
    [1, 1, 0],
    [0, 1, 1], // Z block
  ],
];

// Function to initialize the game board
function initializeBoard() {
  board = Array.from({ length: 20 }, () => Array(10).fill(0));
}

// Function to shuffle the array of shapes
function shuffleShapes() {
  for (let i = SHAPES.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [SHAPES[i], SHAPES[j]] = [SHAPES[j], SHAPES[i]];
  }
}

// Function to create a new random block
function createBlock() {
  if (shuffledShapes.length == 0) {
    shuffleShapes();
    shuffledShapes = [...SHAPES]; // Create a copy of SHAPES array
  }

  const shape = shuffledShapes.shift();
  const colorIndex = Math.floor(Math.random() * COLORS.length);

  currentBlock = {
    shape: shape,
    color: COLORS[colorIndex],
    row: 0,
    col: Math.floor((10 - shape[0].length) / 2),
  };
}

// Function to update the scoreboard
function updateScoreboard() {
  const scoreValueElement = document.getElementById("score-value");
  if (scoreValueElement === null) {
    score = 0;
  } else {
    scoreValueElement.textContent = score;
  }
}

// Function to increase the score
function increaseScore(linesCleared) {
  const lineScores = [0, 40, 100, 300, 1200];
  score += lineScores[linesCleared];
  updateScoreboard();
}

// Function to draw the game board
// Function to draw the game board
function drawBoard() {
  const gameBoard = document.getElementById("game-board");
  if (gameBoard === null) {
    return;
  }

  gameBoard.innerHTML = "";

  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell) {
        const block = document.createElement("div");
        block.className = `block block-${COLORS[cell - 1]}`;
        block.style.top = `${rowIndex * 20}px`;
        block.style.left = `${colIndex * 20}px`;
        gameBoard.appendChild(block);
      }
    });
  });

  currentBlock.shape.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell) {
        const block = document.createElement("div");
        block.className = `block block-${currentBlock.color}`;
        block.style.top = `${(rowIndex + currentBlock.row) * 20}px`;
        block.style.left = `${(colIndex + currentBlock.col) * 20}px`;
        gameBoard.appendChild(block);
      }
    });
  });

  for (
    let rowIndex = currentBlock.row + 1;
    rowIndex < board.length;
    rowIndex++
  ) {
    for (let colIndex = 0; colIndex < board[0].length; colIndex++) {
      if (
        board[rowIndex][colIndex] &&
        !currentBlock.shape[rowIndex - currentBlock.row - 1] &&
        !currentBlock.shape[rowIndex - currentBlock.row]
      ) {
        const block = document.createElement("div");
        block.className = `block block-${COLORS[board[rowIndex][colIndex] - 1]
          }`;
        block.style.top = `${rowIndex * 20}px`;
        block.style.left = `${colIndex * 20}px`;
        block.style.opacity = "0.5";
        gameBoard.appendChild(block);
      }
    }
  }
}

// Function to move the current block down
function moveDown() {
  currentBlock.row++;
  if (checkCollision()) {
    currentBlock.row--;
    placeBlock();
    createBlock();
    if (checkCollision()) {
      endGame();
    }
  }
}

// Function to move the current block left
function moveLeft() {
  currentBlock.col--;
  if (checkCollision()) {
    currentBlock.col++;
  }
}

// Function to move the current block right
function moveRight() {
  currentBlock.col++;
  if (checkCollision()) {
    currentBlock.col--;
  }
}

// Function to perform a hard drop
function hardDrop() {
  while (!checkCollision()) {
    currentBlock.row++;
  }
  currentBlock.row--;
  placeBlock();
  createBlock();
  if (checkCollision()) {
    endGame();
  }
}

// Function to rotate the current block
function rotateBlock() {
  const rotatedShape = [];
  const rows = currentBlock.shape.length;
  const cols = currentBlock.shape[0].length;

  for (let col = 0; col < cols; col++) {
    const newRow = [];
    for (let row = rows - 1; row >= 0; row--) {
      newRow.push(currentBlock.shape[row][col]);
    }
    rotatedShape.push(newRow);
  }

  const originalShape = currentBlock.shape;
  currentBlock.shape = rotatedShape;

  if (checkCollision()) {
    currentBlock.shape = originalShape;
  }
}

// Function to check if there's a collision
function checkCollision() {
  const shape = currentBlock.shape;
  const row = currentBlock.row;
  const col = currentBlock.col;

  for (let rowIndex = 0; rowIndex < shape.length; rowIndex++) {
    for (let colIndex = 0; colIndex < shape[0].length; colIndex++) {
      if (
        shape[rowIndex][colIndex] &&
        (row + rowIndex >= board.length ||
          col + colIndex < 0 ||
          col + colIndex >= board[0].length ||
          board[row + rowIndex][col + colIndex])
      ) {
        return true;
      }
    }
  }

  return false;
}

// Function to place the current block on the game board
function placeBlock() {
  const shape = currentBlock.shape;
  const row = currentBlock.row;
  const col = currentBlock.col;

  for (let rowIndex = 0; rowIndex < shape.length; rowIndex++) {
    for (let colIndex = 0; colIndex < shape[0].length; colIndex++) {
      if (shape[rowIndex][colIndex]) {
        board[row + rowIndex][col + colIndex] =
          COLORS.indexOf(currentBlock.color) + 1;
      }
    }
  }

  clearLines();
  updateScoreboard();
}

// Function to clear completed lines
function clearLines() {
  let linesCleared = 0;

  for (let rowIndex = board.length - 1; rowIndex >= 0; rowIndex--) {
    if (board[rowIndex].every((cell) => cell !== 0)) {
      board.splice(rowIndex, 1);
      board.unshift(Array(10).fill(0));
      linesCleared++;
    }
  }

  increaseScore(linesCleared);

  if (linesCleared > 0) {
    clearLines(); // Recursively check for additional lines to clear
  }
}

// Function to start the game
function startGame() {
  initializeBoard();
  createBlock();
  updateScoreboard();
  drawBoard();
  intervalId = setInterval(() => {
    moveDown();
    drawBoard();
  }, 500);

  document.addEventListener("keydown", handleKeyDown);
}

// Function to handle keydown events
function handleKeyDown(event) {
  switch (event.key) {
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
    case "ArrowDown":
      moveDown();
      break;
    case "ArrowUp":
      rotateBlock();
      break;
    case "z":
      hardDrop();
      break;
  }
  drawBoard();
}

// Function to end the game and reload the page
function endGame() {
  clearInterval(intervalId);
  alert("Game Over!");
  // Retrieve user ID and game ID from localStorage
  const storedUserId = localStorage.getItem("userid");
  const storedGameId = localStorage.getItem("gameid");
  const highscore = score; // Get the score from the game
  createScore(storedUserId,storedGameId,highscore)

  retrieveHighscore();
  location.reload();
}

// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", function () {
  // Access the start button and add event listener
  retrieveHighscore();
  var startButton = document.getElementById("start-button");
  startButton.addEventListener("click", function () {
    clearInterval(intervalId);
    startGame();
  });
  var resetButton = document.getElementById("reset-button");
  resetButton.addEventListener("click", function () {
    resetHighscore();
  });
});

function retrieveHighscore() {
  const storedUserId = localStorage.getItem("userid");
  const storedGameId = localStorage.getItem("gameid");
  const userid = parseInt(storedUserId);
  const gameid = parseInt(storedGameId);

  if (isNaN(userid) || isNaN(gameid)) {
    alert("Please go back to main.html and try again");
    return;
  }

  // Construct the URL with query parameters
  const url = `/api/highscore/getHighscore/${userid}/${gameid}`;

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

        alert("Score retrieved successfully.");
        // Update the high score element in the HTML
        console.log(data.highscore);
        const highscoreValueElement =
          document.getElementById("highscore-value");
        highscoreValueElement.textContent = data.highscore;
      } else {
        alert("Failed to retrieve score. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // Log additional information about the error
      console.log("Error status:", error.status);
      console.log("Error message:", error.message);
    });
}



function resetHighscore() {
  const storedUserId = localStorage.getItem("userid");
  const storedGameId = localStorage.getItem("gameid");
  const userid = parseInt(storedUserId);
  const gameid = parseInt(storedGameId);

  if (isNaN(userid) || isNaN(gameid)) {
    alert("Please go back to main.html and try again");
    return;
  }

  // Construct the URL with query parameters
  const url = `/api/highscore/reset/${userid}/${gameid}`;

  // Send the PUT request to the API
  fetch(url, {
    method: "PUT",
  })
    .then((response) => {
      // Check the URL of the response
      console.log("Connected to:", response.url);
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (data != null && data != undefined) {
        alert("Score reset successfully.");
        // Update the high score element in the HTML
        const highscoreValueElement = document.getElementById("highscore-value");

        highscoreValueElement.textContent = data.highscore;
      } else {
        alert("Failed to reset score. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // Log additional information about the error
      console.log("Error status:", error.status);
      console.log("Error message:", error.message);
    });
}




