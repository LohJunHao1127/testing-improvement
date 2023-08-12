defaultSettings = {
    rotate: "ArrowUp",
    left: "ArrowLeft",
    right: "ArrowRight",
    down: "ArrowDown",
    drop: "Space Bar",
    hold: "c",
    pause: "x",
    reset: "r",
};







document.addEventListener("DOMContentLoaded", function () {


    retrieveSettings();

    const rotateKey = document.getElementById("rotateInput");

    const leftKey = document.getElementById("leftInput");

    const rightKey = document.getElementById("rightInput");

    const downKey = document.getElementById("downInput");

    const dropKey = document.getElementById("dropInput");

    const holdKey = document.getElementById("holdInput");

    const pauseKey = document.getElementById("pauseInput");

    const resetKey = document.getElementById("restartInput");

    rotateKey.addEventListener("keydown", function (event) {
        // Prevent the default behavior of the pressed key (e.g., scrolling for arrow keys)
        event.preventDefault();

        // Get the name of the input field to update based on the key pressed
        const key = event.key;
        const fieldName = mapKeyToFieldName(key);

        // Update the corresponding input field with the pressed key
        if (fieldName) {
            const inputField = rotateKey;
            inputField.value = fieldName;
        }
    });

    leftKey.addEventListener("keydown", function (event) {
        event.preventDefault();
        const key = event.key;
        const fieldName = mapKeyToFieldName(key);

        if (fieldName) {
            const inputField = leftKey;
            inputField.value = fieldName;
        }
    });

    rightKey.addEventListener("keydown", function (event) {
        event.preventDefault();
        const key = event.key;
        const fieldName = mapKeyToFieldName(key);

        if (fieldName) {
            const inputField = rightKey;
            inputField.value = fieldName;
        }
    });

    downKey.addEventListener("keydown", function (event) {
        event.preventDefault();
        const key = event.key;
        const fieldName = mapKeyToFieldName(key);

        if (fieldName) {
            const inputField = downKey;
            inputField.value = fieldName;
        }
    });

    dropKey.addEventListener("keydown", function (event) {
        event.preventDefault();
        const key = event.key;
        const fieldName = mapKeyToFieldName(key);

        if (fieldName) {
            const inputField = dropKey;
            inputField.value = fieldName;
        }
    });

    holdKey.addEventListener("keydown", function (event) {
        event.preventDefault();
        const key = event.key;
        const fieldName = mapKeyToFieldName(key);

        if (fieldName) {
            const inputField = holdKey
            inputField.value = fieldName;
        }
    });

    pauseKey.addEventListener("keydown", function (event) {
        event.preventDefault();
        const key = event.key;
        const fieldName = mapKeyToFieldName(key);

        if (fieldName) {
            const inputField = pauseKey
            inputField.value = fieldName;
        }
    });

    resetKey.addEventListener("keydown", function (event) {
        event.preventDefault();
        const key = event.key;
        const fieldName = mapKeyToFieldName(key);

        if (fieldName) {
            const inputField = resetKey
            inputField.value = fieldName;
        }
    });


    var saveButton = document.getElementById("Save-button");
    saveButton.addEventListener("click", function () {
        event.preventDefault();
        createNewSetting();
    });

    var resetButton = document.getElementById("Reset-button");
    resetButton.addEventListener("click", function () {
        event.preventDefault();
        resetSettings();
    });








});
// Function to map keys to field names
function mapKeyToFieldName(key) {
    switch (key) {
        case " ": // Space bar
            return "Space Bar";

        default:
            return key; // Return key if the key doesn't need to be mapped
    }
}

function resetSettings() {

    const rotateKey = document.getElementById("rotateInput");

    const leftKey = document.getElementById("leftInput");

    const rightKey = document.getElementById("rightInput");

    const downKey = document.getElementById("downInput");

    const dropKey = document.getElementById("dropInput");

    const holdKey = document.getElementById("holdInput");

    const pauseKey = document.getElementById("pauseInput");

    const resetKey = document.getElementById("restartInput");

    rotateKey.value = defaultSettings.rotate;
    leftKey.value = defaultSettings.left;
    rightKey.value = defaultSettings.right;
    downKey.value = defaultSettings.down;
    dropKey.value = defaultSettings.drop;
    holdKey.value = defaultSettings.hold;
    pauseKey.value = defaultSettings.pause;
    resetKey.value = defaultSettings.reset;


}



function createNewSetting() {
    // Retrieve user ID and game ID from localStorage
    const storedUserId = localStorage.getItem("userid");
    const userid = parseInt(storedUserId);
    if (isNaN(userid)) {
        return;
    }
    const rotateKey = document.getElementById("rotateInput").value;
    const leftKey = document.getElementById("leftInput").value;
    const rightKey = document.getElementById("rightInput").value;
    const downKey = document.getElementById("downInput").value;
    const dropKey = document.getElementById("dropInput").value;
    const holdKey = document.getElementById("holdInput").value;
    const pauseKey = document.getElementById("pauseInput").value;
    const resetKey = document.getElementById("restartInput").value;

    // Create a Set to keep track of assigned keys
    const assignedKeys = new Set([rotateKey,leftKey, rightKey, downKey, dropKey, holdKey, pauseKey, resetKey]);

    // Check if any of the keys are the same
    if (assignedKeys.size !== 8) {
        alert("Please ensure that all keys are unique.");
        return;
    }


    // Send the highscore, user ID, and game ID to the API
    fetch("/api/tetrisSettings/settingsCreate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userid: userid,
            rotate: rotateKey,
            left: leftKey,
            right: rightKey,
            down: downKey,
            drop: dropKey,
            hold: holdKey,
            pause: pauseKey,
            reset: resetKey,

        }),
    })
        .then((response) => {
            // Check the response status code
            if (response.ok) {
                console.log("Connected to:", response.url);
                return response.json();
            } else {
                throw new Error(`Request failed with status ${response.status}`);
            }
        })
        .then((data) => {
            console.log(data);
            if (data.success) {
                alert("Tetris Settings Saved successfully.");
            } else {
                alert("Failed to save Tetris Settings. Please try again.");
                console.error("Error:", data);
                // Log additional information about the error
                console.log("Error status:", data.status);
                console.log("Error message:", data.message);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            // Log additional information about the error
            console.log("Error status:", error.status);
            console.log("Error message:", error.message);
        });
}

function retrieveSettings() {
    const storedUserId = localStorage.getItem("userid");
    const userid = parseInt(storedUserId);
    if (isNaN(userid)) {
        return;
    }
    // Construct the URL with query parameters
    const url = `/api/tetrisSettings/settingsRetrive/${userid}`;

    // Send the GET request to the API
    fetch(url)
        .then((response) => {
            // Check the URL of the response
            console.log("Connected to:", response.url);
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                // Update the high score element in the HTML
                var settings = data.result[0][0];
                console.log(settings.rotateKey);
                const rotateKey = document.getElementById("rotateInput");
                rotateKey.value = settings.rotateKey;
                const leftKey = document.getElementById("leftInput");
                leftKey.value = settings.leftKey;
                const rightKey = document.getElementById("rightInput");
                rightKey.value = settings.rightKey;
                const downKey = document.getElementById("downInput");
                downKey.value = settings.downKey;
                const dropKey = document.getElementById("dropInput");
                dropKey.value = settings.dropKey;
                const holdKey = document.getElementById("holdInput");
                holdKey.value = settings.holdKey;
                const pauseKey = document.getElementById("pauseInput");
                pauseKey.value = settings.pauseKey;
                const resetKey = document.getElementById("restartInput");
                resetKey.value = settings.resetKey;
                alert("Retrieved Tetris Settings.");
            } else {
                alert("Failed to retrieve Tetris Settings. Please try again.");
                const rotateKey = document.getElementById("rotateInput");
                rotateKey.value = defaultSettings.rotate;
                const leftKey = document.getElementById("leftInput");
                leftKey.value = defaultSettings.left;
                const rightKey = document.getElementById("rightInput");
                rightKey.value = defaultSettings.right;
                const downKey = document.getElementById("downInput");
                downKey.value = defaultSettings.down;
                const dropKey = document.getElementById("dropInput");
                dropKey.value = defaultSettings.drop;
                const holdKey = document.getElementById("holdInput");
                holdKey.value = defaultSettings.hold;
                const pauseKey = document.getElementById("pauseInput");
                pauseKey.value = defaultSettings.pause;
                const resetKey = document.getElementById("restartInput");
                resetKey.value = defaultSettings.reset;
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            // Log additional information about the error
            console.log("Error status:", error.status);
            console.log("Error message:", error.message);
            const rotateKey = document.getElementById("rotateInput");
            rotateKey.value = defaultSettings.rotate;
            const leftKey = document.getElementById("leftInput");
            leftKey.value = defaultSettings.left;
            const rightKey = document.getElementById("rightInput");
            rightKey.value = defaultSettings.right;
            const downKey = document.getElementById("downInput");
            downKey.value = defaultSettings.down;
            const dropKey = document.getElementById("dropInput");
            dropKey.value = defaultSettings.drop;
            const holdKey = document.getElementById("holdInput");
            holdKey.value = defaultSettings.hold;
            const pauseKey = document.getElementById("pauseInput");
            pauseKey.value = defaultSettings.pause;
            const resetKey = document.getElementById("restartInput");
            resetKey.value = defaultSettings.reset;
        });
}
