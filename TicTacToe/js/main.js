var gameCode;
var board = document.getElementById('board');
let currentPlayer = "X";
var createGameBtn = document.getElementById('createGame');
var joinButton = document.getElementById("joinButton");

getInitialBoard();

createGameBtn.addEventListener("click", function () {
    gameCode = generateGameCode();
    createGame();
    window.location.href = 'game.html';
});

joinButton.addEventListener("click", function () {
    handleJoinButtonClick();
});

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

function generateGameCode() {
    // Generate a random 6-digit code
    // var code = Math.floor(100000 + Math.random() * 900000);
    var code = '123456';
    return code.toString();
}

function createGame() {
    var createUrl = `http://localhost:8080/tictactoe/tictactoeserver/createGame?key=${gameCode}`;

    for (var i = 0; i < 3; i++) {
        // Make a GET request to the servlet
        fetch(createUrl)
            .then(response => response.json())
            .then(data => {
                // Handle the response data here
                console.log("Game created:", data);
            })
            .catch(error => {
                console.error("Error creating game:", error);
            });
    }

}

function handleJoinButtonClick() {
    // Use the prompt function to get a 6-digit input from the user
    var userInput = prompt("Enter the 6-digit code:");

    // Check if the user entered a valid 6-digit code
    if (userInput !== null && userInput.match(/^\d{6}$/)) {
        // Use the entered code in the URL for the servlet request
        var servletURL = `http://localhost:8080/tictactoe/tictactoeserver/check?key=${userInput}`;

        // Make an asynchronous request to the servlet
        fetch(servletURL)
            .then(response => response.json())
            .then(data => {
                // Check if the response from the servlet is true
                if (data === true) {
                    // Redirect to the game.html page
                    window.location.href = 'game.html';
                } else {
                    // Show an error message or handle the case when the response is false
                    alert("Invalid code. Please try again.");
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                // Handle the error, e.g., show an error message to the user
            });
    } else {
        // Show an error message or handle invalid input
        alert("Please enter a valid 6-digit code.");
    }
}

// Function to update the board based on the received data
function updateBoard(data) {
    const cells = board.querySelectorAll('.cell');
    const cellContents = data.split(':');

    for (let i = 0; i < cells.length; i++) {
        cells[i].textContent = cellContents[i];
    }
}

function getInitialBoard() {
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
}



