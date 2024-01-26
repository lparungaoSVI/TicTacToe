var gameCode;
gameCode = getGeneratedCode();
document.addEventListener("DOMContentLoaded", function () {
    
    let currentPlayer = "X";
    var board = document.createElement("div");
    board.id = 'board';

    var checkButton = document.createElement("button");
    checkButton.className = 'button';
    checkButton.id = "checkButton";
    checkButton.textContent = "Check";
    checkButton.addEventListener("click", function () {
        check();
    });

    var resetButton = document.createElement("button");
    resetButton.className = 'button';
    resetButton.id = "resetButton";
    resetButton.textContent = "Reset";
    resetButton.addEventListener("click", function () {
        reset();
    });
    // Function to update the board based on the received data
    function updateBoard(data) {
        const cells = board.querySelectorAll('.cell');
        const cellContents = data.split(':');
        
        for (let i = 0; i < cells.length; i++) {
            cells[i].textContent = cellContents[i];
        }
    }

    // Create 3x3 grid
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = i;
            cell.dataset.col = j;

            cell.addEventListener("click", function () {
                if (!cell.classList.contains("clicked")) {
                    cell.classList.add("clicked");
                    cell.textContent = currentPlayer;

                    // Get the tile and position information
                    const playerTile = currentPlayer;
                    const yPos = cell.dataset.row;
                    const xPos = cell.dataset.col;

                    // Construct the URL with parameters
                    const moveUrl = `http://localhost:8080/tictactoe/tictactoeserver/move?key=${gameCode}&tile=${playerTile}&y=${yPos}&x=${xPos}`;

                    // Make a move using the fetch API
                    fetch(moveUrl)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }
                            return response.text(); // Assuming the response is a plain text representing the board
                        })
                        .then(data => {
                            // Update the board based on the received data
                            updateBoard(data);
                        })
                        .catch(error => {
                            // Handle errors
                            console.error("Error:", error);
                        });

                    currentPlayer = currentPlayer === "X" ? "O" : "X"; // Toggle player
                }
            });
            board.appendChild(cell);
        }
    }

    // Get the initial board content
    const initialBoardUrl = `http://localhost:8080/tictactoe/tictactoeserver/board?key=${gameCode}`;
    fetch(initialBoardUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text(); // Assuming the response is a plain text representing the board
        })
        .then(initialBoardData => {
            // Update the board based on the initial data
            updateBoard(initialBoardData);
        })
        .catch(error => {
            // Handle errors
            console.error("Error:", error);
        });

    document.body.appendChild(board);
    document.body.appendChild(checkButton);
    document.body.appendChild(resetButton);
});

// Function to update the board based on the received data
function updateBoard(data) {
    const cells = board.querySelectorAll('.cell');
    const cellContents = data.split(':');

    for (let i = 0; i < cells.length; i++) {
        cells[i].textContent = cellContents[i];
    }
}

function reset() {
    var resetUrl = `http://localhost:8080/tictactoe/tictactoeserver/reset?key=${gameCode}`;
    // Make a GET request to the servlet
    fetch(resetUrl)
        .then(response => response.json())
        .then(data => {
            // Handle the response data here
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        });
}

function check() {
    
    var checkUrl = `http://localhost:8080/tictactoe/tictactoeserver/check?key=${gameCode}`;
    console.log(checkUrl);
    // Make a GET request to the servlet
    fetch(checkUrl)
        .then(response => response.json())
        .then(data => {
            // Handle the response data here
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        });
}

