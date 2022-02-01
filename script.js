const Player = sign => {
    return {sign};
}

const gameBoard = (() => {
    let board = new Array(9).fill("")

    const setField = (index, type) => {
        if (0 <= index && index < board.length) {
            return board[index] = type;
        }
        return;
    }

    const getField = (index) => {
        if (0 <= index && index < board.length) {
            return board[index];
        }
        return;
    }

    const reset = () => {
        return board = new Array(9).fill("")
    }
    return {setField, getField, reset}
})();

const displayController = (() => {
    let cells = document.querySelectorAll(".cell")
    let messageContainer = document.querySelector(".message")

    cells.forEach((cell) => {
        cell.addEventListener("click", e => {
            if (e.target.innerText !== "" || gameController.isItOver()) return;
            gameController.play(parseInt(e.target.getAttribute("id")));
            updateBoard();
        })
    })
    const resetColor = (boardCells) => {
        boardCells.forEach(cell => {
            cell.style.color = "#000"
        })
    }

    const restart = (player) => {
        resetColor(cells)
        gameController.reset()
        gameBoard.reset()
        updateBoard()
        turnMessage(player)
    }
    
    const updateBoard = () => {
        for (let i = 0; i < cells.length; i++) {
            cells[i].innerText = gameBoard.getField(i);
        }
    }

    const resultMessage = result => {
        if (result == "Draw") {
            messageContainer.innerText = `Its Draw!`
        } else {
            messageContainer.innerText = `Player ${result} has Won!`
        }
    };
    const turnMessage = player => {
        messageContainer.innerText = `Its ${player} turn!`
    };
    
    return {updateBoard, resultMessage, turnMessage, restart};
})();

const gameController = (() => {
    var PlayerX = Player("X")
    var PlayerO = Player("O")
    let round = 1;
    let isOver = false;
    let firstPlayer = "X"
    let restartButton = document.querySelector(".restart-btn")
    let p1Color = "#17a2b8";
    let p2Color = "#dc3545";

    const isItOver = () => {
        return isOver
    }

    const play = cellIndex => {
        gameBoard.setField(cellIndex, getPlayerSign())
        if(checkWin(cellIndex).win) {
            colorCells(checkWin(cellIndex).playerWinCombo)
            isOver = true;
            displayController.resultMessage(getPlayerSign())
            firstPlayer == "X"? firstPlayer = "O":firstPlayer = "X";
            restartButton.addEventListener("click", () => {
                displayController.restart(firstPlayer)
            })
            return
        }
        if(round==9) {
            isOver = true
            displayController.resultMessage("Draw")
            firstPlayer == "X"? firstPlayer = "O":firstPlayer = "X";
            restartButton.addEventListener("click", () => {
                displayController.restart(firstPlayer)
            })
            return
        }
        round++;
        displayController.turnMessage(getPlayerSign())
    }

    const getPlayerSign = () => {
        if (firstPlayer == "X") {
           return (round % 2) === 1? PlayerX.sign : PlayerO.sign;
        } else {
          return (round % 2) === 1? PlayerO.sign : PlayerX.sign;
        }
        
    };

    const checkWin = index => {
        const winCombo = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        let playercombo = winCombo.filter(combo => combo.includes(index))
        let win = playercombo.some( array => array.every(num => gameBoard.getField(num) == getPlayerSign()));
        let playerWinCombo = playercombo.map( array => array.filter(num => gameBoard.getField(num) == getPlayerSign()))
                                .filter(winArrays => winArrays.length == 3)
        return {win, playerWinCombo}
    }

    const colorCells = (win) => {
        win = win[0]
        win.forEach(num => {
            cell = document.getElementById(num);
            if (firstPlayer == "X") {
                return (round % 2) === 1? cell.style.color = p1Color : cell.style.color = p2Color;
             } else {
               return (round % 2) === 1? cell.style.color = p2Color : cell.style.color = p1Color;
             }
        })
        return
    }

    const reset = () => {
        round = 1
        isOver = false
    }
    return {play, getPlayerSign, isItOver, reset, firstPlayer};
})();