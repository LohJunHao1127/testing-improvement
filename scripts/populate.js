document.addEventListener("DOMContentLoaded", function() {
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
  
    // Fetch user data from the server and populate the form fields
    fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userid: localStorage.getItem("userid") }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        if (!usernameInput.value) {
          usernameInput.value = data.username;
        }
        if (!emailInput.value) {
          emailInput.value = data.email;
        }
        if (!passwordInput.value) {
          passwordInput.value = data.password;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
  