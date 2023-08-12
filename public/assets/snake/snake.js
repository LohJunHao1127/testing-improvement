function runSnakeGame(socket, roomCode) {
  console.log("RUn snake game")
  const board = document.querySelector("#board1");
  const display = board.getContext("2d");
  const resetBtn = document.querySelector("#reset");
  const scoreBox = document.querySelector("#scoreBox");
  const gameBoardWidth = board.width;
  const gameBoardHeight = board.height;
  const boardBackground = "white";
  const snakeBorder = "black";
  const foodColor = "red";
  const unitSize = 25;
  let currentDirection;
  let gameOver = false;

  // Handle 'game state' events from the server
  socket.on('game state', (data) => {
    console.log("here 1");
    // Clear the game board
    clearBoard();

    // Render the food
    drawFood(data.food.x, data.food.y);

    // Render each player's snake
    drawSnakes(data);

    // Render the power-ups
    for (const powerUp of data.powerUps) {
      drawPowerUp(powerUp);
    }


    // Update the score display
    scoreBox.innerHTML = "";
    let playerNumber = 1;
    for (const playerId in data.players) {
      const player = data.players[playerId];
      const scoreElement = document.createElement("div");
      scoreElement.textContent = `Player ${playerNumber}: ${player.score}`;
      scoreElement.style.color = player.color;
      scoreElement.style.marginRight = "20px"; // Add a margin to the right of the element
      scoreBox.appendChild(scoreElement);
      playerNumber++;
    }


    currentDirection = data.players[socket.id].direction;
  });

  socket.on('game over', (isGameOverForPlayer) => {
    if (isGameOverForPlayer) {
      displayGameOver();
      socket.disconnect();
      resetBtn.style.display = "block";
      resetBtn.addEventListener("click", () => location.reload());
    }
  });

  socket.on('time remaining', (data) => {
    const minutes = Math.floor(data.timeRemaining / 60);
    const seconds = data.timeRemaining % 60;
    document.querySelector('#time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  });

  // Client-side code
  socket.on('game won', () => {
    console.log('Received game won event');
    displayWinner();
  });

  socket.on('times up', () => {
    gameOver = true;
    displayTimesUp();

    // Handle 'leaderboard' events from the server
    socket.on('leaderboard', (data) => {
      console.log('Received leaderboard event with data:', data);
      // Add a delay before displaying the leaderboard
      setTimeout(() => {
        displayLeaderboard(data);
      }, 3000); // 3 seconds delay
    });
  });


  // Client-side code
  function displayWinner() {
    socket.disconnect();
    console.log('Displaying winner');
    display.font = "50px MV Boli";
    display.fillStyle = "black";
    display.textAlign = "center";
    display.fillText("You are the winner!", gameBoardWidth / 2, gameBoardHeight / 2);
  }

  function displayGameOver() {
    display.font = "50px MV Boli";
    display.fillStyle = "black";
    display.textAlign = "center";
    display.fillText("GAME OVER!", gameBoardWidth / 2, gameBoardHeight / 2);
  }

  function displayTimesUp() {

    console.log('Displaying times up');
    display.font = "50px MV Boli";
    display.fillStyle = "black";
    display.textAlign = "center";
    display.fillText("Times Up!", gameBoardWidth / 2, gameBoardHeight / 2);
  }


  function displayLeaderboard(data) {
    // Clear the game board
    scoreBox.innerHTML = "";
    clearBoard();

    // Draw a background for the leaderboard
    display.fillStyle = "white";
    display.fillRect(50, 50, gameBoardWidth - 100, gameBoardHeight - 100);

    // Display the leaderboard title using the 'Caprasimo' font
    display.font = "30px 'Caprasimo', cursive";
    display.fillStyle = "black";
    display.textAlign = "center";
    display.fillText("Leaderboard", gameBoardWidth / 2, 100);

    // Initialize the animation state
    let alpha = 0;
    let y = 150;
    let rank = 1;

    // Start the animation loop
    requestAnimationFrame(animate);

    function animate() {
      // Clear the previous frame
      clearBoard();

      // Draw a background for the leaderboard
      display.fillStyle = "white";
      display.fillRect(50, 50, gameBoardWidth - 100, gameBoardHeight - 100);

      // Display the leaderboard title using the 'Caprasimo' font
      display.font = "30px 'Caprasimo', cursive";
      display.fillStyle = "black";
      display.textAlign = "center";
      display.fillText("Leaderboard", gameBoardWidth / 2, 100);

      // Update the animation state
      alpha += 0.01;
      if (alpha > 1) {
        alpha = 1;
      }

      // Set the global alpha for the player scores
      display.globalAlpha = alpha;

      // Display the player scores and ranks using the default font
      y = 150;
      rank = 1;
      for (const player of data.players) {
        display.font = "20px sans-serif";
        display.fillText(`Rank ${rank}: ${player.name} - ${player.score}`, gameBoardWidth / 2, y);
        y += 50;
        rank++;
      }

      // Reset the global alpha
      display.globalAlpha = 1;

      // Request the next frame of the animation
      if (alpha < 1) {
        requestAnimationFrame(animate);
      }
    }
  }




  function clearBoard() {
    display.fillStyle = boardBackground;
    display.fillRect(0, 0, gameBoardWidth, gameBoardHeight);
  }

  function drawFood(x, y) {
    display.fillStyle = foodColor;
    display.fillRect(x, y, unitSize, unitSize);
  }

  function drawSnakes(gameState) {
    for (const playerId in gameState.players) {
      const player = gameState.players[playerId];
      drawSnake(player.position, player.color);
    }
  }

  function drawSnake(position, color) {
    display.fillStyle = color;
    display.strokeStyle = snakeBorder;
    position.forEach((snakePart) => {
      display.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
      display.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    });
  }


  function drawPowerUp(powerUp) {
    switch (powerUp.type) {
      case 'stun':
        display.fillStyle = 'blue';
        break;
      case 'doubleScore':
        display.fillStyle = 'yellow';
        break;
      case 'invincibility':
        display.fillStyle = 'green';
        break;
    }
    display.fillRect(powerUp.x, powerUp.y, unitSize, unitSize);
  }


  function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    let newDirection;
    switch (keyPressed) {
      case LEFT:
        if (currentDirection !== 'right') {
          newDirection = 'left';
        }
        break;
      case UP:
        if (currentDirection !== 'down') {
          newDirection = 'up';
        }
        break;
      case RIGHT:
        if (currentDirection !== 'left') {
          newDirection = 'right';
        }
        break;
      case DOWN:
        if (currentDirection !== 'up') {
          newDirection = 'down';
        }
        break;
    }

    // Emit a 'change direction' event to the server
    if (newDirection) {
      socket.emit('change direction', { roomCode, newDirection });
    }
  }
  document.addEventListener('keydown', changeDirection);

  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      socket.emit('speed up', { roomCode, playerId: socket.id });
    }
  });

  document.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
      socket.emit('slow down', { roomCode, playerId: socket.id });
    }
  });

}
