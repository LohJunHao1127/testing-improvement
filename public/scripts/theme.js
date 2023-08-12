document.addEventListener("DOMContentLoaded", function () {
    // Get the selected theme from local storage and apply it
    const selectedTheme = getSelectedTheme();
    applyTheme(selectedTheme);
  
    // Function to apply the selected theme to the body
    function applyTheme(theme) {
      const body = document.querySelector("body");
      body.classList.remove("theme-light", "theme-dark");
      body.classList.add("theme-" + theme);
    }
  
    // Function to get the selected theme from local storage
    function getSelectedTheme() {
      const theme = localStorage.getItem("selectedTheme");
      return theme ? theme : "light";
    }
  
    // Calling applyTheme() when the page loads to apply the selected theme
    applyTheme(selectedTheme);
  
  });
  