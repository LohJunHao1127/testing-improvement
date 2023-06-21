document.addEventListener("DOMContentLoaded", function() {
  // Get the selected theme from local storage and apply it
  const selectedTheme = getSelectedTheme();
  applyTheme(selectedTheme);

  // Fetch the user ID from local storage and update the username
  getUserIdFromLocalStorage()
    .then((userid) => {
      if (userid) {
        return fetchUsername(userid);
      } else {
        throw new Error("User ID not found in local storage");
      }
    })
    .then((username) => {
      updateUsername(username);
      showUserSection();
      showFavoritesButton();
    })
    .catch((error) => {
      console.error("Failed to update username", error);
    });

  // Toggle theme switch event listener
  const toggleSwitch = document.querySelector("#theme-toggle");
  if (toggleSwitch) {
    toggleSwitch.addEventListener("change", () => {
      const theme = toggleSwitch.checked ? "dark" : "light";
      applyTheme(theme);
      saveSelectedTheme(theme);
      updateThemePreference(theme); // Update theme preference on the server
    });
  }

  // Get the selected volume from local storage and set it
  const selectedVolume = getSelectedVolume();
  setVolume(selectedVolume);

  // Volume slider change event listener
  const volumeSlider = document.querySelector("#volume-slider");
  if (volumeSlider) {
    volumeSlider.addEventListener("change", () => {
      const volume = volumeSlider.value;
      setVolume(volume);
      saveSelectedVolume(volume);
      updateVolumePreference(volume); // Update volume preference on the server
    });
  }

  // Function to get the selected theme from local storage
  function getSelectedTheme() {
    const theme = localStorage.getItem("selectedTheme");
    return theme ? theme : "light";
  }

  // Function to apply the selected theme to the body and toggle switch
  function applyTheme(theme) {
    const body = document.querySelector("body");
    body.classList.remove("theme-light", "theme-dark");
    body.classList.add("theme-" + theme);

    const toggleSwitch = document.querySelector("#theme-toggle");
    if (toggleSwitch) {
      toggleSwitch.checked = theme === "dark";
    }

    saveSelectedTheme(theme); // Save selected theme to local storage
  }

  // Function to save the selected theme to local storage
  function saveSelectedTheme(theme) {
    localStorage.setItem("selectedTheme", theme);
  }

  // Function to update the theme preference on the server
  function updateThemePreference(theme) {
    getUserIdFromLocalStorage().then((userid) => {
      if (userid) {
        fetch("/api/settings/background", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ background: theme }),
        })
          .then((response) => {
            if (response.ok) {
              console.log("Theme preference updated successfully");
            } else {
              console.error("Failed to update theme preference");
            }
          })
          .catch((error) => {
            console.error("Failed to update theme preference", error);
          });
      } else {
        console.log("User not logged in, temporary theme preference saved");
      }
    });
  }

  // Function to get the selected volume from local storage
  function getSelectedVolume() {
    const volume = localStorage.getItem("selectedVolume");
    return volume ? volume : 50;
  }

  // Function to set the volume slider value
  function setVolume(volume) {
    const volumeSlider = document.querySelector("#volume-slider");
    if (volumeSlider) {
      volumeSlider.value = volume;
    }
  }

  // Function to save the selected volume to local storage
  function saveSelectedVolume(volume) {
    localStorage.setItem("selectedVolume", volume);
  }

  // Function to update the volume preference on the server
  function updateVolumePreference(volume) {
    getUserIdFromLocalStorage().then((userid) => {
      if (userid) {
        fetch("/api/settings/volume", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ volume }),
        })
          .then((response) => {
            if (response.ok) {
              console.log("Volume preference updated successfully");
            } else {
              console.error("Failed to update volume preference");
            }
          })
          .catch((error) => {
            console.error("Failed to update volume preference", error);
          });
      } else {
        console.log("User not logged in, temporary volume preference saved");
      }
    });
  }

  // Calling functions to Fetch the user ID from local storage and update the username
  getUserIdFromLocalStorage()
    .then((userid) => {
      if (userid) {
        return fetchUsername(userid);
      } else {
        throw new Error("User ID not found in local storage");
      }
    })
    .then((username) => {
      updateUsername(username);
    })
    .catch((error) => {
      console.error("Failed to update username", error);
    });

  // Add event listener to the "Get My Favorite Settings" button
  const getFavoriteSettingsButton = document.querySelector(
    "#get-favorite-settings-btn"
  );
  if (getFavoriteSettingsButton) {
    getFavoriteSettingsButton.addEventListener("click", getFavoriteSettings);
  }
});

// Function to get the user ID from local storage
function getUserIdFromLocalStorage() {
  return new Promise((resolve) => {
    const userid = localStorage.getItem("userid");
    console.log(userid);
    resolve(userid);
  });
}

// Function to show the user section and hide the login section
function showUserSection() {
  const loginSection = document.querySelector("#login-section");
  const userSection = document.querySelector("#user-section");
  if (loginSection && userSection) {
    loginSection.style.display = "none";
    userSection.style.display = "block";
  }
}

// Function to show the favorites button
function showFavoritesButton() {
  const favoritesButton = document.querySelector("#get-favorite-settings-btn");
  if (favoritesButton) {
    favoritesButton.style.display = "block";
  }
}

// Function to fetch the favorite settings from the server
function fetchFavoriteSettings(userid) {
  return fetch(`/api/settings/${userid}/favorite-settings`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to fetch favorite settings");
      }
    })
    .catch((error) => {
      console.error("Failed to fetch favorite settings", error);
      return {};
    });
}

// Function to get the favorite settings for the user
function getFavoriteSettings() {
  getUserIdFromLocalStorage()
    .then((userid) => {
      if (userid) {
        return fetchFavoriteSettings(userid);
      } else {
        throw new Error("User ID not found in local storage");
      }
    })
    .then((response) => {
      return response.json();
    })
    .then((settings) => {
      console.log(settings);
      displayFavoriteSettings(settings);
    })
    .catch((error) => {
      console.error("Failed to get favorite settings", error);
    });
}

// Function to display the favorite settings on the settings page
function displayFavoriteSettings(settings) {
  const favoriteSettingsElement = document.querySelector("#favorite-settings");
  if (favoriteSettingsElement) {
    favoriteSettingsElement.textContent = JSON.stringify(settings);
  }
}

// Function to fetch the favorite settings from the server
function fetchFavoriteSettings(userid) {
  return fetch(`/api/settings/${userid}/favorite-settings`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to fetch favorite settings");
      }
    })
    .catch((error) => {
      console.error("Failed to fetch favorite settings", error);
      return {};
    });
}

// Function to display the favorite settings on the settings page
function displayFavoriteSettings(settings) {
  const favoriteSettingsElement = document.querySelector("#favorite-settings");
  if (favoriteSettingsElement) {
    favoriteSettingsElement.textContent = JSON.stringify(settings);
  }
}

// Function to fetch the username from the server
function fetchUsername(userid) {
  return fetch(`/api/settings/username/${userid}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to fetch username");
      }
    })
    .then((data) => {
      console.log(data);
      if (data.success) {
        alert("Username retrieved successfully.");
        console.log(data.username);
        return data.username;
      } else {
        alert("Failed to retrieve username. Please try again.");
        console.error("Error:", data);
        console.log("Error status:", data.status);
        console.log("Error message:", data.message);
      }
    })
    .catch((error) => {
      console.error("Failed to fetch username", error);
      return "";
    });
}

// Delete button click event listener
const deleteButton = document.querySelector("#delete-btn");
deleteButton.addEventListener("click", () => {
  deleteSettings(); // Delete settings from local storage
  deleteServerSettings(); // Delete settings on the server
});

// Function to delete the settings from local storage
function deleteSettings() {
  if (
    confirm(
      "Are you sure you want to delete your settings? This action cannot be undone."
    )
  ) {
    localStorage.removeItem("selectedTheme");
    localStorage.removeItem("selectedVolume");
    alert("Settings deleted successfully");
  }
}

// Function to delete the settings on the server
function deleteServerSettings() {
  getUserIdFromLocalStorage().then((userid) => {
    if (userid) {
      fetch("/api/settings/delete/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            console.log("User settings deleted successfully");
          } else {
            console.error("Failed to delete user settings");
          }
        })
        .catch((error) => {
          console.error("Failed to delete user settings", error);
        });
    }
  });
}
