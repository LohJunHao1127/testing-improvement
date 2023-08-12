//Function to navigate to homepage
function goToHomePage() {
  const isLoggedIn = !!localStorage.getItem("userid");

  if (isLoggedIn) {
    window.location.href = "../../pages/index.html";
  } else {
    window.location.href = "../../main.html";
  }
}

// Function to navigate to the game page
function goToGamePage() {
  window.location.href = "2048.html";
}

// Function to navigate to the leaderboard page
function goToLeaderboardPage() {
  window.location.href = "2048leaderboard.html";
}


// Function to navigate to the settings page
function goToSettingsPage() {
  window.location.href = "../../pages/settings.html";
}

// Function to navigate to login page
function goToLoginPage() {
  window.location.href = "../../pages/login.html";
}

// Function to handle the logout action
function logout() {
  // Clear the userid from local storage or perform any other logout actions
  localStorage.removeItem("userid");

  // Redirect to the main page or any other desired location
  window.location.href = "../../main.html";
}

// Function to show the logout confirmation popup
function showLogoutConfirmation() {
  // Display a confirmation dialog
  const confirmation = confirm("Are you sure you want to log out?");

  // If the user confirms, perform logout actions
  if (confirmation) {
    logout();
  }
}

// Function to check if the user is logged in and toggle buttons accordingly
function checkLoginStatus() {
  const isLoggedIn = !!localStorage.getItem("userid");
  const logoutButton = document.getElementById("logoutButton");
  const loginButton = document.getElementById("loginButton");
  const welcomeMessage = document.getElementById("welcomeMessage");

  if (isLoggedIn) {
    const username = localStorage.getItem("userid"); // Use "userName" instead of "username"
    welcomeMessage.textContent = `Welcome to 2048 User ${username}!`;
    logoutButton.style.display = "block";
    loginButton.style.display = "none";
  } else {
    welcomeMessage.textContent = "Welcome to 2048!";
    logoutButton.style.display = "none";
    loginButton.style.display = "block";
  }
}

// Call the function on page load to check login status
document.addEventListener("DOMContentLoaded", checkLoginStatus);
