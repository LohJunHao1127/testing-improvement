// JavaScript code for the game

// Variables for game state
let board = [];
let currentBlock = {};
let currentGhostBlock = {};
let drawIntervalId;
let moveIntervalId;
let score = 0;
// first shuffledShapes provides the shapes to be added to game board
let shuffledShapes = [];
let shuffledShapes2 = [];
let isPaused = false;
const BLOCK_SIZE = 24.89; // Define the block size
let heldBlock;
let blockSpeedIntervalId;
let BlockSpeed = 500;

let lineScores;

let defaultSettings = {
  rotate: "ArrowUp",
  left: "ArrowLeft",
  right: "ArrowRight",
  down: "ArrowDown",
  drop: " ",
  hold: "c",
  pause: "x",
  reset: "r"
};

let Settings = {
  rotate: "",
  left: "",
  right: "",
  down: "",
  drop: "",
  hold: "",
  pause: "",
  reset: ""

};


// Array of colors for each block
const COLORS = [
  "cyan",
  "blue",
  "orange",
  "yellow",
  "lime",
  "purple",
  "red"
];

// Object representing each block
const BLOCKS = [
  {
    shape: [[1, 1, 1, 1]], // Straight Block
    color: "cyan",
  },
  {
    shape: [
      [2, 2, 2],
      [0, 0, 2], // J block
    ],
    color: "blue",
  },
  {
    shape: [
      [3, 3, 3],
      [3, 0, 0], // L block
    ],
    color: "orange",
  },
  {
    shape: [
      [4, 4],
      [4, 4], // Square block
    ],
    color: "yellow",
  },
  {
    shape: [
      [0, 5, 5],
      [5, 5, 0], // S block
    ],
    color: "lime",
  },
  {
    shape: [
      [6, 6, 6],
      [0, 6, 0], // T block
    ],
    color: "purple",
  },
  {
    shape: [
      [7, 7, 0],
      [0, 7, 7], // Z block
    ],
    color: "red",
  },
];



// Function to initialize the game board
function initializeBoard() {
  board = Array.from({ length: 20 }, () => Array(10).fill(0));
}

// Function to shuffle the array of shapes
function shuffleShapes() {
  // meaning this is the first time running the app
  for (let i = BLOCKS.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [BLOCKS[i], BLOCKS[j]] = [BLOCKS[j], BLOCKS[i]];

  }
}

// Function to create a new random block
function createBlock() {
  if (shuffledShapes.length == 0 && shuffledShapes2.length == 0) {
    shuffleShapes();
    shuffledShapes = [...BLOCKS]; // Create a copy of SHAPES array
    shuffleShapes();
    shuffledShapes2 = [...BLOCKS]; // Create a copy of SHAPES array
  } else if (shuffledShapes.length == 0 && shuffledShapes2.length != 0) {
    //meaning shuffledShapes2 exist while shuffledShapes has nothing
    // so shuffledShape has been called finished
    shuffledShapes = shuffledShapes2;
    // replaces the elements in the array
    shuffleShapes();
    shuffledShapes2 = [...BLOCKS]; // Create a copy of SHAPES array
  }

  // if (heldBlock !== null) {
  //     // If there is a held block, use it as the next block and reset the heldBlock variable
  //     currentBlock = heldBlock;
  //     currentBlock.row = 0;
  //     currentBlock.col = Math.floor((10 - currentBlock.shape[0].length) / 2);
  //     heldBlock = null;
  // } else if (heldBlock === null) {
  //     // If there is no held block, get the next block from the shuffledShapes array
  //     const shape = shuffledShapes.shift();

  // }

  const block = shuffledShapes.shift();

  currentBlock = {
    shape: block.shape,
    color: block.color,
    row: 0,
    col: Math.floor((10 - block.shape[0].length) / 2),
  };
  currentGhostBlock = {
    shape: currentBlock.shape,
    color: currentBlock.color,
    row: 0,
    col: Math.floor((10 - currentBlock.shape[0].length) / 2),
  };

  updatePreview();
}



// Function to create a single preview block
function createPreviewBlock(block, container) {
  if (!block || !block.shape || !Array.isArray(block.shape)) {
    console.error("Error: Invalid block object.");
    return;
  }

  block.shape.forEach((row) => {
    if (!Array.isArray(row)) {
      console.error("Error: Each row in the block shape should be an array.");
      return;
    }

    const previewRow = document.createElement("div");
    previewRow.classList.add("preview-row");

    row.forEach((cell) => {
      const previewCell = document.createElement("div");
      previewCell.classList.add("preview-cell");

      if (cell) {
        previewCell.style.backgroundColor = block.color;
      }

      previewRow.appendChild(previewCell);
    });

    container.appendChild(previewRow);
  });
}

function updatePreview() {
  const previewBlock1 = document.getElementById("preview-block1");
  const previewBlock2 = document.getElementById("preview-block2");
  const previewBlock3 = document.getElementById("preview-block3");

  // Clear existing preview blocks
  previewBlock1.innerHTML = "";
  previewBlock2.innerHTML = "";
  previewBlock3.innerHTML = "";

  let nextShape1;
  let nextShape2;
  let nextShape3;

  // Check if there are enough shuffled shapes remaining
  if (shuffledShapes.length >= 3) {
    // Get the next three shapes from the shuffledShapes array
    nextShape1 = shuffledShapes[0];
    nextShape2 = shuffledShapes[1];
    nextShape3 = shuffledShapes[2];

    // Create preview blocks for each shape
    createPreviewBlock(nextShape1, previewBlock1);
    createPreviewBlock(nextShape2, previewBlock2);
    createPreviewBlock(nextShape3, previewBlock3);
  } else if (shuffledShapes.length < 3) {
    var arrlength = shuffledShapes.length;

    switch (arrlength) {
      case 2:
        nextShape1 = shuffledShapes[0];
        nextShape2 = shuffledShapes[1];
        nextShape3 = shuffledShapes2[0];

        // Create preview blocks for each shape
        createPreviewBlock(nextShape1, previewBlock1);
        createPreviewBlock(nextShape2, previewBlock2);
        createPreviewBlock(nextShape3, previewBlock3);
        break;
      case 1:
        nextShape1 = shuffledShapes[0];
        nextShape2 = shuffledShapes2[0];
        nextShape3 = shuffledShapes2[1];

        // Create preview blocks for each shape
        createPreviewBlock(nextShape1, previewBlock1);
        createPreviewBlock(nextShape2, previewBlock2);
        createPreviewBlock(nextShape3, previewBlock3);
        break;
      case 0:
        nextShape1 = shuffledShapes2[0];
        nextShape2 = shuffledShapes2[1];
        nextShape3 = shuffledShapes2[2];

        // Create preview blocks for each shape
        createPreviewBlock(nextShape1, previewBlock1);
        createPreviewBlock(nextShape2, previewBlock2);
        createPreviewBlock(nextShape3, previewBlock3);

        break;
      default:
        break;
    }
  }
}

function updateHeldBlock() {
  const heldBlockContainer = document.getElementById("hold");

  // Clear existing held block
  heldBlockContainer.innerHTML = "";

  if (heldBlock !== null) {
    console.log("Held block:", heldBlock);
    // Create a preview block for the held block
    createHeldBlock(heldBlock, heldBlockContainer);
  }
}

// Function to create a single preview block
function createHeldBlock(block, container) {
  if (!block || !block.shape || !Array.isArray(block.shape)) {
    console.error("Error: Invalid block object.");
    return;
  }

  block.shape.forEach((row) => {
    if (!Array.isArray(row)) {
      console.error("Error: Each row in the block shape should be an array.");
      return;
    }

    const heldRow = document.createElement("div");
    heldRow.classList.add("held-row");

    row.forEach((cell) => {
      const heldCellContainer = document.createElement("div"); // Create a container for each cell
      heldCellContainer.classList.add("held-cell");

      if (cell) {
        heldCellContainer.style.backgroundColor = block.color;
      }

      heldRow.appendChild(heldCellContainer); // Append the cell container to the row
    });

    container.appendChild(heldRow);
  });
}

function holdBlock() {


  if (heldBlock === undefined || heldBlock === null) {
    // If no block is currently held, store the currentBlock and create a new one
    heldBlock = {
      shape: currentBlock.shape,
      color: currentBlock.color,
      row: 0,
      col: Math.floor((10 - currentBlock.shape[0].length) / 2),
    }


    createBlock();
  } else if (heldBlock !== null && heldBlock !== undefined) {
    // If a block is already held, swap it with the currentBlock
    console.log("Held block before change:", heldBlock);
    let temp = {
      shape: heldBlock.shape,
      color: heldBlock.color,
      row: 0,
      col: Math.floor((10 - heldBlock.shape[0].length) / 2),
    };
    heldBlock = {
      shape: currentBlock.shape,
      color: currentBlock.color,
      row: 0,
      col: Math.floor((10 - currentBlock.shape[0].length) / 2),
    }
    currentBlock = {
      shape: temp.shape,
      color: temp.color,
      row: 0,
      col: Math.floor((10 - temp.shape[0].length) / 2),
    }
    console.log("Held block after change:", heldBlock);


    currentGhostBlock = {
      shape: currentBlock.shape,
      color: currentBlock.color,
      row: 0,
      col: Math.floor((10 - currentBlock.shape[0].length) / 2),
    }

  }
  updateHeldBlock();
  updatePreview();

  drawBoard();
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

  score += lineScores[linesCleared];
  updateScoreboard();
}

// Function to draw the current block and the ghost block on the board
function drawCurrentBlock() {

  const gameBoard = document.getElementById("game-board");
  if (gameBoard === null) {
    return;
  }

  // Remove the existing current and ghost blocks from the game board
  const currentBlocks = document.querySelectorAll(".current-block");
  currentBlocks.forEach((block) => block.remove());


  // Draw the falling block on the board
  currentBlock.shape.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell) {
        const colorIndex = BLOCKS.findIndex(
          (block) => block.color === currentBlock.color
        );
        const block = document.createElement("div");
        block.className = `block block-${BLOCKS[colorIndex].color} current-block`;
        block.style.top = `${(rowIndex + currentBlock.row) * BLOCK_SIZE}px`;
        block.style.left = `${(colIndex + currentBlock.col) * BLOCK_SIZE}px`;
        block.style.width = `${BLOCK_SIZE}px`; // Set the block width
        block.style.height = `${BLOCK_SIZE}px`; // Set the block height
        gameBoard.appendChild(block);
      }
    });
  });

  drawCurrentGhostBlock();
}


function drawCurrentGhostBlock() {

  const gameBoard = document.getElementById("game-board");
  if (gameBoard === null) {
    return;
  }

  // Remove the existing current and ghost blocks from the game board
  const currentGhostBlocks = document.querySelectorAll(".current-ghost-block");
  currentGhostBlocks.forEach((block) => block.remove());

  // Draw the ghost block (semi-transparent) to show where the current block will land
  for (let rowIndex = currentGhostBlock.row; rowIndex < currentGhostBlock.row + currentGhostBlock.shape.length; rowIndex++) {
    for (let colIndex = 0; colIndex < currentGhostBlock.shape[0].length; colIndex++) {
      const cell = currentGhostBlock.shape[rowIndex - currentGhostBlock.row][colIndex];
      if (cell) {
        const colorIndex = BLOCKS.findIndex(
          (block) => block.color === currentGhostBlock.color
        );
        const block = document.createElement("div");
        block.className = `block block-${BLOCKS[colorIndex].color} current-ghost-block`;
        block.style.top = `${rowIndex * BLOCK_SIZE}px`;
        block.style.left = `${(currentGhostBlock.col + colIndex) * BLOCK_SIZE}px`;
        block.style.width = `${BLOCK_SIZE}px`;
        block.style.height = `${BLOCK_SIZE}px`;
        block.style.opacity = "0.5";
        gameBoard.appendChild(block);
      }
    }
  }
  currentGhostBlock.row = currentBlock.row;
  while (!checkGhostCollision()) {
    currentGhostBlock.row++;

  }
  currentGhostBlock.row--;

}


// Function to draw the blocks currently on the board
function drawStaticBlocks() {
  const gameBoard = document.getElementById("game-board");
  if (gameBoard === null) {
    return;
  }

  // Remove the existing static blocks from the game board
  const staticBlocks = document.querySelectorAll(".static-block");
  staticBlocks.forEach((block) => block.remove());

  // Draw the current blocks on the board
  for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
    for (let colIndex = 0; colIndex < board[rowIndex].length; colIndex++) {
      // Check if there is a block (non-zero value) at the current position on the board
      if (board[rowIndex][colIndex]) {
        // Calculate the colorIndex by subtracting 1 from the value in the board array
        const colorIndex = board[rowIndex][colIndex] - 1;
        // Create a new block element and add it to the game board

        const block = document.createElement("div");
        block.className = `block block-${COLORS[colorIndex]} static-block`;
        block.style.top = `${rowIndex * BLOCK_SIZE}px`;
        block.style.left = `${colIndex * BLOCK_SIZE}px`;
        block.style.width = `${BLOCK_SIZE}px`; // Set the block width
        block.style.height = `${BLOCK_SIZE}px`; // Set the block height
        gameBoard.appendChild(block);
      }
    }
  }

}

function drawBoard() {
  drawCurrentBlock();
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
  currentGhostBlock.row = 0;

  currentBlock.col--;
  currentGhostBlock.col--;
  if (checkCollision()) {
    currentBlock.col++;
    currentGhostBlock.col++;
  }
  drawCurrentGhostBlock()
}

// Function to move the current block right
function moveRight() {
  currentGhostBlock.row = 0;

  currentBlock.col++;
  currentGhostBlock.col++;
  if (checkCollision()) {
    currentBlock.col--;
    currentGhostBlock.col--;
  }
  drawCurrentGhostBlock()
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
  currentGhostBlock.shape = rotatedShape;

  if (checkCollision()) {
    currentBlock.shape = originalShape;
    currentGhostBlock.shape = originalShape;
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

// Function to check if there's a collision
function checkGhostCollision() {
  const shape = currentGhostBlock.shape;
  const row = currentGhostBlock.row;
  const col = currentGhostBlock.col;

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
        const blockValue = shape[rowIndex][colIndex]

        board[row + rowIndex][col + colIndex] = blockValue;
      }
    }
  }

  clearLines();
  drawStaticBlocks();
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

// Function to handle keydown events
function handleKeyDown(event) {
  event.preventDefault();
  if (!isPaused) {
    switch (event.key) {
      case Settings.left:
        moveLeft();
        break;
      case Settings.right:
        moveRight();
        break;
      case Settings.down:
        moveDown();
        break;
      case Settings.rotate:
        rotateBlock();
        break;
      case Settings.drop:
        hardDrop();
        break;
      case Settings.pause:
        pauseGame();
        break;
      case Settings.hold:
        holdBlock();
        break;
      case Settings.reset:
        location.reload();
        break;
      case "Escape":
        endGame()
        break;
    }
    drawBoard();
  } else {
    switch (event.key) {
      case Settings.pause:
        pauseGame();
        break;
    }
  }
}

function pauseGame() {
  isPaused = !isPaused;
}

// Function to start the game
function startGame() {
  isPaused = false;

  const gameBoard = document.getElementById("game-board");
  if (gameBoard === null) {
    return;
  }

  gameBoard.innerHTML = "";
  retrieveSettings();
  initializeBoard();
  createBlock();
  updateScoreboard();
  drawBoard();
  // Set interval for drawBoard() to be called twice as fast (250 milliseconds)
  drawIntervalId = setInterval(() => {
    if (!isPaused) {
      drawBoard();
    }
  }, 0);


  blockSpeedIntervalId = setInterval(() => {
    if (!isPaused) {
      BlockSpeed -= 10;
      for (let i = 1; i < lineScores.length; i++) {
        lineScores[i] += 10;
      }


    }
  }, 10000);

  moveIntervalId = setInterval(() => {
    if (!isPaused) {
      moveDown();
    }
  }, BlockSpeed);

  document.addEventListener("keydown", handleKeyDown);
}

// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", function () {
  // Access the start button and add event listener

  retrieveHighscore();

  var easyButton = document.getElementById("easy-button");
  easyButton.addEventListener("click", function () {
    clearInterval(drawIntervalId);
    clearInterval(moveIntervalId);
    clearInterval(blockSpeedIntervalId);
    BlockSpeed = 800;
    lineScores = [0, 100, 300, 500, 800];
    startGame();
  });
  var mediumButton = document.getElementById("medium-button");
  mediumButton.addEventListener("click", function () {
    clearInterval(drawIntervalId);
    clearInterval(moveIntervalId);
    clearInterval(blockSpeedIntervalId);
    BlockSpeed = 500;
    lineScores = [0, 750, 1500, 2250, 3000 ];
    startGame();
  });

  var hardButton = document.getElementById("hard-button");
  hardButton.addEventListener("click", function () {
    clearInterval(drawIntervalId);
    clearInterval(moveIntervalId);
    clearInterval(blockSpeedIntervalId);
    BlockSpeed = 350;
    lineScores = [0, 1500 , 3000, 4500, 6000];
    startGame();
  });


  var pauseButton = document.getElementById("pause-button");
  pauseButton.addEventListener("click", function () {
    pauseGame();
  });

  var resetButton = document.getElementById("reset-button");
  resetButton.addEventListener("click", function () {
    location.reload();
  });
});

// Function to end the game and reload the page
function endGame() {
  clearInterval(drawIntervalId);
  clearInterval(moveIntervalId);
  clearInterval(blockSpeedIntervalId);
  alert("Game Over!");
  createNewScore();
  localStorage.setItem("gameEnd", "1");
  retrieveHighscore();
  score = 0;
}

function createNewScore() {
  // Retrieve user ID and game ID from localStorage
  const storedUserId = localStorage.getItem("userid");
  const highscore = score; // Get the score from the game

  // Send the highscore, user ID, and game ID to the API
  fetch("/api/tetrisChallenge/createNewScoreChallenge", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userid: storedUserId,
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
        alert("Score insterted successfully.");
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
  const storedUserId = localStorage.getItem("userid");

  const storedGameEnd = localStorage.getItem("gameEnd");
  const userid = parseInt(storedUserId);


  const gameEnd = parseInt(storedGameEnd);

  if (isNaN(userid) && !isNaN(gameEnd)) {
    alert("To Update your HighScore user has to log in");
    localStorage.removeItem("gameEnd");

    return;
  } else if (isNaN(userid) && isNaN(gameEnd)) {
    alert("To Retrive your Score user has to log in");

    return;
  }

  // Construct the URL with query parameters
  const url = `/api/tetrisChallenge/getHighestScore/${userid}`;

  // Send the GET request to the API
  fetch(url)
    .then((response) => {
      // Check the URL of the response
      console.log("Connected to:", response.url);
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        console.log(data.result[0][0])
        score=data.result[0][0].score;

        const highscoreValueElement =
          document.getElementById("highscore-value");
        highscoreValueElement.textContent = score;
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





function retrieveSettings() {
  const storedUserId = localStorage.getItem("userid");
  const userid = parseInt(storedUserId);
  if (isNaN(userid)) {
    return;
  }
  // Construct the URL with query parameters
  const url = `/api/tetrisSettings/settingsRetrive/${userid}`;

  // Send the GET request to the API
  fetch(url)
    .then((response) => {
      // Check the URL of the response
      console.log("Connected to:", response.url);
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        // Update the high score element in the HTML
        var DBsettings = data.result[0][0];
        console.log(DBsettings.rotateKey);
        for(var key in DBsettings){
          if(DBsettings[key] == null){
            DBsettings[key] = defaultSettings[key];
          }
          if(DBsettings[key] == "Space Bar"){
            DBsettings[key] = " ";
          }
        }

        Settings.rotate = DBsettings.rotateKey;
        Settings.left = DBsettings.leftKey;
        Settings.right = DBsettings.rightKey;
        Settings.down = DBsettings.downKey;
        Settings.drop = DBsettings.dropKey;
        Settings.hold = DBsettings.holdKey;
        Settings.pause = DBsettings.pauseKey;
        Settings.reset = DBsettings.resetKey;


        alert("Retrieved Tetris Settings.");
      } else {
        alert("Using default Tetris Settings.");
        Settings.rotate = defaultSettings.rotate;
        Settings.left = defaultSettings.left;
        Settings.right = defaultSettings.right;
        Settings.down = defaultSettings.down;
        Settings.drop = defaultSettings.drop;
        Settings.hold = defaultSettings.hold;
        Settings.pause = defaultSettings.pause;
        Settings.reset = defaultSettings.reset;


      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // Log additional information about the error
      console.log("Error status:", error.status);
      console.log("Error message:", error.message);
              
      Settings.rotate = defaultSettings.rotate;
      Settings.left = defaultSettings.left;
      Settings.right = defaultSettings.right;
      Settings.down = defaultSettings.down;
      Settings.drop = defaultSettings.drop;
      Settings.hold = defaultSettings.hold;
      Settings.pause = defaultSettings.pause;
      Settings.reset = defaultSettings.reset;
      

    });
}