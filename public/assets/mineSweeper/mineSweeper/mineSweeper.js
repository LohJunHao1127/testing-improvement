let boardSize, numMines;

const CLASS_CLICKED = "clicked";
const CLASS_FLAGGED = "flagged";
const CLASS_MINE = "mine";
let board = [];
let gameBoard;
let revealNonMinesCells = 0;
let gameWon = false;
let gameLost = false;
let firstClick = false;
let minesPlaced = 0;
let timerInterval;
let seconds = 0;
let score = 0;
let finalScore = 0;

function calculateScore(seconds) {
    // Define scoring parameters
    boardSize = localStorage.getItem("boardSize");
    if (boardSize == null || boardSize == undefined) {
        boardSize = 5;
    }

    const maxScore = boardSize*20; // Maximum achievable score
    const minSeconds = boardSize*5; // Minimum time (seconds) for maximum score
    const maxSeconds = boardSize*100; // Maximum time (seconds) for minimum score

    // Calculate normalized time between minSeconds and maxSeconds
    const normalizedTime = Math.min(Math.max(seconds, minSeconds), maxSeconds);

    // Calculate the score based on the normalized time
    score = Math.round(
        maxScore * (1 - (normalizedTime - minSeconds) / (maxSeconds - minSeconds))
    );

    return score;
}

function startTimer() {
    
    timerInterval = setInterval(() => {
        seconds++;
        updateTimerDisplay(seconds);
    }, 1000); // Update every 1 second
}

function stopTimer() {
    clearInterval(timerInterval);
}

function updateTimerDisplay(seconds) {
    const timerElement = document.getElementById("timer");
    timerElement.textContent = `Time: ${seconds}`;
}

function startGame() {
    createBoard();
    placeMines();
}

function createBoard() {
    // Create the game board dynamically
    gameBoard = document.getElementById("game-board");
    for (let row = 0; row < boardSize; row++) {
        const newRow = document.createElement("tr");
        board.push([]);
        for (let col = 0; col < boardSize; col++) {
            const newCell = document.createElement("td");
            newCell.addEventListener("click", function (event) {
                revealCell(event, row, col);
            });
            newRow.appendChild(newCell);
            board[row].push({
                element: newCell,
                isMine: false,
                isRevealed: false,
            });
        }
        gameBoard.appendChild(newRow);
    }
}

function placeMines() {
    // Randomly place mines on the game board

    while (minesPlaced < numMines) {
        const randomRow = Math.floor(Math.random() * boardSize);
        const randomCol = Math.floor(Math.random() * boardSize);
        if (!board[randomRow][randomCol].isMine && !board[randomRow][randomCol].isRevealed) {
            board[randomRow][randomCol].isMine = true;
            minesPlaced++;
        }
    }
}



function revealCell(event, row, col) {
    const cell = board[row][col];
    if (cell.isRevealed) return;
    if (gameLost || gameWon) {
        
        return; // Ignore any further clicks if the game is already won or lost
    }
    if (firstClick == false) {
        firstClick = true;
        startTimer();



        if (cell.isMine) {
            minesPlaced--;
            placeMines(); // Place mines again
            cell.isMine = false; // Remove the mine from the first clicked cell
            revealCell(event, row, col); // Reveal the first clicked cell
        } else {
            // Check if the cell is already revealed
            if (cell.isRevealed) {
                return; // Ignore clicks on already revealed cells
            }

            // Handle left-click
            if (event.button === 0) {
                // Check if the cell is flagged
                if (cell.element.classList.contains(CLASS_FLAGGED)) {
                    return; // Ignore left-clicks on flagged cells
                }

                // Reveal the cell and update the content
                cell.isRevealed = true;
                cell.element.classList.add(CLASS_CLICKED);
                const numAdjacentMines = countAdjacentMines(row, col);
                if (numAdjacentMines > 0) {
                    cell.element.textContent = numAdjacentMines;
                } else {
                    // If the cell has no adjacent mines, recursively reveal adjacent cells
                    const adjacentCells = getAdjacentCells(row, col);
                    for (const adjCell of adjacentCells) {
                        revealCell(event, adjCell.row, adjCell.col);
                    }
                }
                revealNonMinesCells++; // Increment the number of revealed non-mine cells

                // Check if the game is won

                if (revealNonMinesCells === boardSize * boardSize - numMines) {
                    gameWon = true;

                    revealMines();
                }
            }
            // Handle right-click
            else if (event.button === 2) {
                if (!cell.isRevealed) {
                    if (cell.element.classList.contains(CLASS_FLAGGED)) {
                        // Unflag the cell
                        cell.element.classList.remove(CLASS_FLAGGED);
                    } else {
                        // Flag the cell
                        cell.element.classList.add(CLASS_FLAGGED);
                    }
                }
            }
        }
    } else {
        if (cell.isMine) {
            // Handle left-click on a mine (game over)
            if (event.button === 0 && !cell.element.classList.contains(CLASS_FLAGGED)) {
                cell.element.classList.add(CLASS_MINE);
                alert("You lost! You clicked on a mine.");
                cell.isRevealed = true;
                revealMines();
                gameLost = true;
            } else if (event.button === 2) {
                if (!cell.isRevealed) {
                    if (cell.element.classList.contains(CLASS_FLAGGED)) {
                        // Unflag the cell
                        cell.element.classList.remove(CLASS_FLAGGED);
                    } else {
                        // Flag the cell
                        cell.element.classList.add(CLASS_FLAGGED);
                    }
                }
            }
        } else {
            // Check if the cell is already revealed
            if (cell.isRevealed) {
                return; // Ignore clicks on already revealed cells
            }

            // Handle left-click
            if (event.button === 0) {
                // Check if the cell is flagged
                if (cell.element.classList.contains(CLASS_FLAGGED)) {
                    return; // Ignore left-clicks on flagged cells
                }

                // Reveal the cell and update the content
                cell.isRevealed = true;
                cell.element.classList.add(CLASS_CLICKED);
                const numAdjacentMines = countAdjacentMines(row, col);
                if (numAdjacentMines > 0) {
                    cell.element.textContent = numAdjacentMines;
                } else {
                    // If the cell has no adjacent mines, recursively reveal adjacent cells
                    const adjacentCells = getAdjacentCells(row, col);
                    for (const adjCell of adjacentCells) {
                        revealCell(event, adjCell.row, adjCell.col);
                    }
                }
                revealNonMinesCells++; // Increment the number of revealed non-mine cells

                // Check if the game is won

                if (revealNonMinesCells === boardSize * boardSize - numMines) {
                    gameWon = true;

                    revealMines();
                }
            }
            // Handle right-click
            else if (event.button === 2) {
                if (!cell.isRevealed) {
                    if (cell.element.classList.contains(CLASS_FLAGGED)) {
                        // Unflag the cell
                        cell.element.classList.remove(CLASS_FLAGGED);
                    } else {
                        // Flag the cell
                        cell.element.classList.add(CLASS_FLAGGED);
                    }
                }
            }
        }
    }

}

function countAdjacentMines(row, col) {
    let count = 0;
    const adjacentCells = getAdjacentCells(row, col);
    for (const adjCell of adjacentCells) {
        if (board[adjCell.row][adjCell.col].isMine) {
            count++;
        }
    }
    return count;
}

function getAdjacentCells(row, col) {
    const adjacentCells = [];
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (
                newRow >= 0 &&
                newRow < boardSize &&
                newCol >= 0 &&
                newCol < boardSize
            ) {
                adjacentCells.push({ row: newRow, col: newCol });
            }
        }
    }
    return adjacentCells;
}

function revealMines() {
    // Reveal all mines
    stopTimer(); // Stop the timer when the game ends
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (
                board[i][j].isMine &&
                board[i][j].element.classList.contains(CLASS_FLAGGED)
            ) {
                board[i][j].element.classList.remove(CLASS_FLAGGED);
                board[i][j].element.classList.add(CLASS_MINE);
                board[i][j].isRevealed = true;
            } else if (board[i][j].isMine) {
                board[i][j].element.classList.add(CLASS_MINE);
                board[i][j].isRevealed = true;
            }
        }
    }

    if (gameLost) {
        const lostAlert = document.createElement("div");
        lostAlert.classList.add("alert", "alert-danger", "text-center");
        lostAlert.textContent = "You lost! You clicked on a mine.";
        document.body.appendChild(lostAlert);
    } else if (gameWon) {
        const wonAlert = document.createElement("div");
        wonAlert.classList.add("alert", "alert-success", "text-center");
        wonAlert.textContent = "You won! You revealed all non-mine cells.";
        document.body.appendChild(wonAlert);
        finalScore = calculateScore(seconds);

        // Display the final score to the user
        console.log(`Your final score is: ${finalScore}`);
        const highscoreValueElement =
        document.getElementById("highscore-value");
        highscoreValueElement.textContent = finalScore;
        createNewScore();
        retrieveHighscore();

    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Start the game
    boardSize = localStorage.getItem("boardSize");
    retrieveHighscore();
    if (boardSize == null || boardSize == undefined) {
        boardSize = 5;
    }

    numMines = (boardSize * boardSize) / 10;
    numMines = Math.floor(numMines);
    startGame();

    // Add event listener for mousedown to handle left-click and right-click
    gameBoard.addEventListener("mousedown", function (event) {

        revealCell(
            event,
            event.target.parentNode.rowIndex,
            event.target.cellIndex
        );


    });

    // Add event listener for contextmenu to prevent the default behavior
    gameBoard.addEventListener("contextmenu", function (event) {
        event.preventDefault();
    });
});



function createNewScore() {
    // Retrieve user ID and game ID from localStorage
    const storedUserId = localStorage.getItem("userid");
    const storedGameId = localStorage.getItem("gameid");
    const highscore = finalScore; // Get the score from the game

    // Send the highscore, user ID, and game ID to the API
    fetch("/api/highscore/createNewScoreTime", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userid: storedUserId,
            gameid: storedGameId,
            score: highscore,
            time: seconds,
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
    const storedGameId = localStorage.getItem("gameid");

    
    const userid = parseInt(storedUserId);
    const gameid = parseInt(storedGameId);

    


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
            if (data.success) {
                // Update the high score element in the HTML

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



