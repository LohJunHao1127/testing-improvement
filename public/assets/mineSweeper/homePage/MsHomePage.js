// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", function () {

    var easyButton = document.getElementById("Easy-button");
    easyButton.addEventListener("click", function () {
        window.location.href = "../mineSweeper/mineSweeper.html"
        localStorage.setItem("boardSize", 10);
    });
    var mediumButton = document.getElementById("Medium-button");
    mediumButton.addEventListener("click", function () {
        window.location.href = "../mineSweeper/mineSweeper.html"
        localStorage.setItem("boardSize", 13);
    });
    var hardButton = document.getElementById("Hard-button");
    hardButton.addEventListener("click", function () {
        window.location.href = "../mineSweeper/mineSweeper.html"
        localStorage.setItem("boardSize", 17);
    });

  });