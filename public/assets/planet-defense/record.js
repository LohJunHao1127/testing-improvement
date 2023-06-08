document.addEventListener('DOMContentLoaded', () => {
    const getAllButton = document.getElementById('getAllButton');
    const highscoreList = document.getElementById('highscoreList');
    const updateButton = document.getElementById('updateButton');
    const updateGameId = document.getElementById('updateGameId');
    const updateResult = document.getElementById('updateResult');
    const deleteButton = document.getElementById('deleteButton');
    const deleteGameId = document.getElementById('deleteGameId');
    const deleteResult = document.getElementById('deleteResult');
  
    // Handle the "Retrieve All Highscores" button click event
    getAllButton.addEventListener('click', () => {
        fetch('/highscore')
            .then(response => response.json())
            .then(data => {
                highscoreList.innerHTML = '';
                data.highscore.forEach(highscore => {
                    const li = document.createElement('li');
                    li.innerText = highscore;
                    highscoreList.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
  
    // Handle the "Update Highscore" button click event
    updateButton.addEventListener('click', () => {
        const gameId = updateGameId.value;
        fetch(`/highscore/${gameId}`, { method: 'PUT' })
            .then(response => response.json())
            .then(data => {
                updateResult.innerText = `Updated highscore: ${data.highscore}`;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
  
    // Handle the "Delete Highscore" button click event
    deleteButton.addEventListener('click', () => {
        const gameId = deleteGameId.value;
        fetch(`/highscore/${gameId}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                deleteResult.innerText = data.message;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
  });
  