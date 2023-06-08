// Delete user
document.addEventListener("DOMContentLoaded", function () {
  const deleteBtn = document.querySelector(".delete-button");
  deleteBtn.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission

    // Check if the user confirms the deletion
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // Send request to delete user information
      fetch("/api/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid: localStorage.getItem("userid") }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("User information deleted successfully."); // Display success message
            // Optionally, you can redirect the user to another page or perform any other action
            window.location.href = "../../main.html";

            // clear userid
            localStorage.removeItem("userid");
          } else {
            alert("Failed to delete user information. Please try again."); // Display error message
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  });
});
