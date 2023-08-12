function storeToLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

function retrieveFromLocalStorage(key) {
  localStorage.getItem(key);
}

// Logging into the application
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector(".login-form");
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Send request to validate credentials
    // Send request to validate credentials
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          storeToLocalStorage("userid", data.userid);
          storeToLocalStorage("whiteUsername", username); // Use 'username' variable here
          window.location.href = "../pages/index.html"; // Redirect to index.html
        } else {
          alert("Username and password not found. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
