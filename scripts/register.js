// Registering a new user
document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.querySelector(".register-form");
  console.log(registerForm);
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("psw");
    const repeatPasswordInput = document.getElementById("psw-repeat");
    // console.log(username, email, password, repeatPassword);

    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const repeatPassword = repeatPasswordInput.value;

    // Validate input fields
    if (password !== repeatPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    // Send request to create a new user
    fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("User created successfully. Please log in."); // Display success message
          window.location.href = "../pages/login.html"; // Redirect to login.html
        } else {
          console.log(data);
          // alert("Failed to create user. Please try again."); // Display error message
          alert("failed: " + data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
