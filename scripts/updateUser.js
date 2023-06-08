// Update user
document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.querySelector(".register-form");
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const repeatPasswordInput = document.getElementById("repeat-password");

    // Assigning the value
    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const repeatPassword = repeatPasswordInput.value;

    // Validate input fields
    if (password !== repeatPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    // Send request to update the user profile
    fetch("/api/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, userid: localStorage.getItem("userid") }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);

        if (data.success) {
          alert("Profile updated successfully."); // Display success message
        } else {
          alert("Failed to update profile. Please try again."); // Display error message
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
