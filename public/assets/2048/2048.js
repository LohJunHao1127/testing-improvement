var board;
var score = 0;
var highscore = 0;
var rows = 4;
var columns = 4;

window.onload = function () {
  setGame();
};

function setGame() {
  // board = [
  //     [2, 2, 2, 2],
  //     [2, 2, 2, 2],
  //     [4, 4, 8, 8],
  //     [4, 4, 8, 8]
  // ];

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  score = 0;
  updateScore();

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      let num = board[r][c];
      updateTile(tile, num);
      document.getElementById("board").append(tile);
    }
  }
  //create 2 to begin the game
  setTwo();
  setTwo();

  startTimer();
}

function updateTile(tile, num) {
  tile.innerText = "";
  tile.classList.value = ""; //clear the classList
  tile.classList.add("tile");
  if (num > 0) {
    tile.innerText = num.toString();
    if (num <= 4096) {
      tile.classList.add("x" + num.toString());
    } else {
      tile.classList.add("x8192");
    }
  }
}

document.addEventListener("keyup", (e) => {
  if (e.code == "ArrowLeft") {
    slideLeft();
    spawnTile();
  } else if (e.code == "ArrowRight") {
    slideRight();
    spawnTile();
  } else if (e.code == "ArrowUp") {
    slideUp();
    spawnTile();
  } else if (e.code == "ArrowDown") {
    slideDown();
    spawnTile();
  }
  updateScore();
  gameover();
});

function filterZero(row) {
  return row.filter((num) => num != 0); //create new array of all nums != 0
}

function slide(row) {
  //[0, 2, 2, 2]
  row = filterZero(row); //[2, 2, 2]
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] == row[i + 1]) {
      row[i] *= 2;
      score += row[i];
      if (score > highscore) {
        highscore = score;
      }
      row[i + 1] = 0;
    }
  } //[4, 0, 2]
  row = filterZero(row); //[4, 2]
  //add zeroes
  while (row.length < columns) {
    row.push(0);
  } //[4, 2, 0, 0]
  return row;
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];
    row = slide(row);
    board[r] = row;
    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r]; //[0, 2, 2, 2]
    row.reverse(); //[2, 2, 2, 0]
    row = slide(row); //[4, 2, 0, 0]
    board[r] = row.reverse(); //[0, 0, 2, 4];
    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    row = slide(row);
    // board[0][c] = row[0];
    // board[1][c] = row[1];
    // board[2][c] = row[2];
    // board[3][c] = row[3];
    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    row.reverse();
    row = slide(row);
    row.reverse();
    // board[0][c] = row[0];
    // board[1][c] = row[1];
    // board[2][c] = row[2];
    // board[3][c] = row[3];
    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}
//setTwo is used for start of game. Afterwards it be spawnTile cuz of the potential x4
function setTwo() {
  if (!hasEmptyTile()) {
    return;
  }
  let found = false;
  while (!found) {
    //find random row and column to place a 2 in
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);
    if (board[r][c] == 0) {
      board[r][c] = 2;
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      tile.innerText = "2";
      tile.classList.add("x2");
      found = true;
    }
  }
}

function hasEmptyTile() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] == 0) {
        //at least one zero in the board
        return true;
      }
    }
  }
  return false;
}
//timer functions
var timer = null;
var seconds = 0;

function startTimer() {
  seconds = 0;
  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  seconds++;
  var timerElement = document.getElementById("timer");
  timerElement.innerHTML = seconds;
}

//spawns a tile after every move with a 10% chance of spawning a x4 instead of x2
function spawnTile() {
  if (!hasEmptyTile()) {
    return;
  }

  let tileValue = Math.random() < 0.9 ? 2 : 4;

  let found = false;
  while (!found) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);
    if (board[r][c] == 0) {
      board[r][c] = tileValue;
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      tile.innerText = tileValue.toString();
      tile.classList.add("x" + tileValue.toString());
      found = true;
    }
  }
}

function moveTiles() {
  if (timer === null) {
    startTimer();
  }
}

function updateScore() {
  document.getElementById("score").innerText = score;
  document.getElementById("highscore").innerText = highscore;
}

// Game over functions
function isGameOver() {
  if (hasEmptyTile()) {
    return false;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tileValue = board[r][c];

      // Check if any adjacent tiles have the same value
      if (c < columns - 1 && board[r][c + 1] === tileValue) {
        return false;
      }
      if (r < rows - 1 && board[r + 1][c] === tileValue) {
        return false;
      }
    }
  }

  // No empty tiles and no adjacent tiles with the same value
  return true;
}

function gameover() {
  // Check if the game is over
  if (isGameOver()) {
    // Stop the timer
    clearInterval(timer);
    timer = null;

    // Show the game over popup
    showGameOverPopup();
  }
}

// Popup functions
function showGameOverPopup() {
  let popup = document.getElementById("popup");
  popup.style.display = "block";

  let scoreElement = document.getElementById("popup-score");
  scoreElement.innerText = score;

  let timeElement = document.getElementById("popup-time");
  timeElement.innerText = seconds + " seconds";
}

function resetGame() {
  let popup = document.getElementById("popup");
  popup.style.display = "none";

  var boardElement = document.getElementById("board");
  while (boardElement.firstChild) {
    boardElement.firstChild.remove();
  }

  setGame();
}

function goToHomepage() {
  // Redirect to the homepage
  window.location.href = "../../main.html";
  alert("Redirecting to the homepage...");
}
  function goToSettings() {
    window.location.href = "settings.html";
  }