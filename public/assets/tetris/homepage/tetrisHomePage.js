// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", function () {

    var startButton = document.getElementById("Start-button");
    startButton.addEventListener("click", function () {
        window.location.href = "../game/tetris.html"
    });
    var challengeButton = document.getElementById("Challenges-button");
    challengeButton.addEventListener("click", function () {
        window.location.href = "../challenges/tetrisChallenge.html"
    });
    var settingsButton = document.getElementById("Settings-button");
    settingsButton.addEventListener("click", function () {
        window.location.href = "../Settings/tetrisSetting.html"
    });

  });