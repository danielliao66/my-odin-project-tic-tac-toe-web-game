const displayController = (() => {
    const markers = ["O", "X"];
    const names = ["", ""];
    let turn = 0;
    let count = 0;
    const switchForm = (switchOn) => {
        if (switchOn) {
            document.getElementById("1first").checked = true;
        }
        else {
            document.getElementById("name1").value = "";
            document.getElementById("name2").value = "";
            document.getElementById("2first").checked = false;
        }
        document.getElementById("form").style.display = switchOn ? "block" : "none";
        document.getElementById("submit").style.display = switchOn ? "block" : "none";
    }
    const switchBoard = (switchOn) => {
        document.getElementById("board").style.display = switchOn ? "block" : "none";
    }
    const switchStartGame = (switchOn) => {
        document.getElementById("start-game").style.display = switchOn ? "block" : "none";
    }
    const switchNewGame = (switchOn) => {
        document.getElementById("new-game").style.display = switchOn ? "block" : "none";
    }
    const getName = id => document.getElementById(id).value;
    
    const getCheckState = id => document.getElementById(id).checked;

    const getTiles = () => document.getElementsByTagName("td");

    const getTile = id => document.getElementById(id);
    
    const start = () => {
        switchForm(true);
        switchStartGame(false);
    }
    const submit = () => {
        const name1 = getName("name1");
        const name2 = getName("name2");
        names[0] = name1 === "" ? "Player 1" : name1;
        names[1] = name2 === "" ? "Player 2" : name2;
        if (getCheckState("2first")) {
            turn = 1;
        }
        switchBoard(true);
        switchForm(false);
        switchNewGame(true);
    }
    const restart = () => {
        reset();
        const tiles = getTiles();
        for (let i = 0; i < tiles.length; i++) {
            tiles[i].innerHTML = "";
        }
        switchBoard(false);
        switchStartGame(true);
        switchNewGame(false);
    }
    const checkLegal = index => gameBoard.tiles[index] === -1;

    const makeMove = index => {
        gameBoard.tiles = gameBoard.tiles.map((tile, i) => (index == i) ? turn : tile)
        getTile(index).innerHTML = markers[turn];
    }

    const getStatus = (index) => {
        if ((gameBoard.tiles[index] == gameBoard.tiles[(index + 3) % 9] &&
             gameBoard.tiles[index] == gameBoard.tiles[(index + 6) % 9]) ||
            (gameBoard.tiles[index] == gameBoard.tiles[3 * Math.floor(index / 3) + (index + 1) % (3 * Math.ceil(index / 3))] &&
             gameBoard.tiles[index] == gameBoard.tiles[3 * Math.floor(index / 3) + (index + 2) % (3 * Math.ceil(index / 3))])) {
                 return "wol";
             }
        if ((index == 0 || index == 8) &&
            (gameBoard.tiles[0] == gameBoard.tiles[4] &&
             gameBoard.tiles[0] == gameBoard.tiles[8])) {
            return "wol";
        }
        if ((index == 2 || index == 4 || index == 6) &&
            (gameBoard.tiles[2] == gameBoard.tiles[4] &&
             gameBoard.tiles[2] == gameBoard.tiles[6])) {
            return "wol";
        }
        return count == 9 ? "tie" : "pending";     
    }
    const showResult = (result) => {
        setTimeout(() => {
            alert(`${(result === "wol") ? names[turn] + " wins!" : "Tie!"}\nGame Over.`);
            restart();
        }, 100);
    }
    const showWarning = () => {
        alert(`${names[turn]} cannot play that move!`);
    }
    const reset = () => {
        gameBoard.tiles = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
        count = 0;
        turn = 0;
    }    
    const onAttempt = (tile) => {
        if (checkLegal(tile.id)) {
            makeMove(tile.id);
            count++;
            const status = getStatus(tile.id);
            if (status != "pending") {
                showResult(status);
                return;
            }
            turn = turn === 0 ? 1 : 0;
        }
        else {
            showWarning();
        }
    }    
    return {start, submit, restart, onAttempt};
})();

const gameBoard = (() => {
    let boardTiles = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
    return {
        get tiles() {return boardTiles;},
        set tiles(newTiles) {boardTiles = newTiles;}
    }    
})();