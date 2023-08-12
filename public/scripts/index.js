function selectGame(gameid) {
    // Storing the selected gameid in localStorage
    localStorage.setItem('gameid', gameid);
    if (gameid == 1) {
        window.location.href = '/assets/snake/homepage.html'; // Replace with the actual game page URL
    } else if (gameid == 2) {
        window.location.href = '/assets/2048/2048home.html';
    } else if (gameid == 3) {
        window.location.href = '/assets/space-invaders/index.html';
    } else if (gameid == 4) {
        window.location.href = '/assets/tetris/homepage/tetrisHomePage.html';
    } else if (gameid == 5) {
        window.location.href = '/assets/planet-defense/homepage.html';
    }else if (gameid == 6) {
        window.location.href = '/assets/blackjack/home.html';
    }else if (gameid == 7) {
        window.location.href = '/assets/chess/home.html';
    }
    else if (gameid == 8) {
        window.location.href = '/assets/mineSweeper/homePage/MsHomePage.html';
    }
}