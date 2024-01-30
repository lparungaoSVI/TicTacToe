document.addEventListener("DOMContentLoaded", function () {
    // Create section element
    const section = document.createElement('section');

    // Create h1 element with class "game--title"
    const h1 = document.createElement('h1');
    h1.className = 'game--title';
    h1.textContent = 'Tic-Tac-Toe';

    // Create game container div
    const gameContainer = document.createElement('div');
    gameContainer.className = 'game--container';

    // Create 9 cells inside the game container
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('data-cell-index', i);
        gameContainer.appendChild(cell);
    }

    // Create h2 element with class "game--status"
    const h2 = document.createElement('h2');
    h2.className = 'game--status';

    // Create check button
    const checkButton = document.createElement('button');
    checkButton.className = 'game-button check-btn';
    checkButton.textContent = 'Check';

    // Create reset button
    const resetButton = document.createElement('button');
    resetButton.className = 'game-button rst-btn';
    resetButton.textContent = 'Reset';

    // Create check button
    const createButton = document.createElement('button');
    createButton.className = 'game-button crt-btn';
    createButton.textContent = 'Create';

    // Create start button
    const startButton = document.createElement('button');
    startButton.className = 'game-button start-btn';
    startButton.textContent = 'Start';

    // Append all elements to the section
    section.appendChild(h1);
    section.appendChild(gameContainer);
    section.appendChild(h2);
    section.appendChild(checkButton);
    section.appendChild(resetButton);
    section.appendChild(createButton);
    section.appendChild(startButton);

    // Append the section to the body of the HTML document
    document.body.appendChild(section);

    var gameCode = '123456';

    const statusDisplay = document.querySelector('.game--status');

    const welcome = () => `Welcome to Tic Tac Toe`;
    const noGame = () => `No Game to Reset`;
    const gameNotExisting = () => `Game is not existing`;
    const gameIsReady = () => `Game is Ready. Press Start.`;

    statusDisplay.innerHTML = welcome();

    var intervalId;

    async function checkGameExistence() {
        try {
            const response = await fetch(`http://localhost:8080/tictactoe/tictactoeserver/check?key=${gameCode}`);

            if (!response.ok) {
                throw new Error(`Failed to check game existence: ${response.status}`);
            }

            const gameExists = await response.json(); // Assuming the server responds with a JSON object indicating existence

            return gameExists;
        } catch (error) {
            console.error('Error checking game existence:', error.message);
            return false; // Return false in case of an error
        }
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

    document.querySelector('.check-btn').addEventListener('click', async () => {
        clearInterval(intervalId);
        const gameExists = await checkGameExistence();

        if (gameExists) {
            statusDisplay.innerHTML = gameIsReady();
        } else {
            statusDisplay.innerHTML = gameNotExisting();
        }
    });

    document.querySelector('.crt-btn').addEventListener('click', async () => {
        clearInterval(intervalId);
        const gameExists = await checkGameExistence();

        if (gameExists) {
            statusDisplay.innerHTML = gameIsReady();
        } else {
            createGame();
            statusDisplay.innerHTML = gameIsReady();
        }
    });
    document.querySelector('.rst-btn').addEventListener('click', async () => {
        clearInterval(intervalId);
        const gameExists = await checkGameExistence();

        if (gameExists) {
            reset();
            statusDisplay.innerHTML = welcome();
        } else {
            createGame();
            statusDisplay.innerHTML = noGame();
        }
    });

    document.querySelector('.start-btn').addEventListener('click', async () => {
        const gameExists = await checkGameExistence();

        if (gameExists) {

            let currentPlayer = "X";
            let gameState = ["", "", "", "", "", "", "", "", ""];
            const winningMessage = () => `Player ${currentPlayer} has won!`;
            const drawMessage = () => `Game ended in a draw!`;
            const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

            const winningConditions = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
            ];

            let roundWon = false;

            // Function to update the game board based on the current game state
            function updateBoard() {
                document.querySelectorAll('.cell').forEach((cell, index) => {
                    cell.innerHTML = gameState[index];
                });
                statusDisplay.innerHTML = currentPlayerTurn();
            }

            // Function to initialize the game state from local storage
            async function getBoard() {
                try {
                    const response = await fetch(`http://localhost:8080/tictactoe/tictactoeserver/board?key=${gameCode}`);

                    if (!response.ok) {
                        throw new Error(`Failed to fetch game board: ${response.status}`);
                    }

                    const boardString = await response.text();
                    gameState = boardString.split(':'); // Assuming the board is represented as "X:O:X:O:X:O:X:O:X:"
                    updateBoard();
                    handleResultValidation();
                    // Count the number of 'X' and 'O' in the initial board state
                    const countX = gameState.filter(tile => tile === 'X').length;
                    const countO = gameState.filter(tile => tile === 'O').length;

                    // Set the currentPlayer based on the counts
                    currentPlayer = countX > countO ? 'O' : 'X';

                } catch (error) {
                    console.error('Error initializing game:', error.message);
                }
            }

            intervalId = setInterval(getBoard, 100); // Get Board every 100ms
            statusDisplay.innerHTML = currentPlayerTurn();

            function handleCellClick(clickedCellEvent) {
                const clickedCell = clickedCellEvent.target;
                const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

                if (gameState[clickedCellIndex] !== "" || roundWon)
                    return;

                handleCellPlayed(clickedCell, clickedCellIndex);

            }

            // Function to handle playing a cell and updating the game state on the server
            async function handleCellPlayed(clickedCell, clickedCellIndex) {
                if (gameState[clickedCellIndex] !== "" || roundWon) {
                    return;
                }

                try {
                    // Make a POST request to the server to execute the move
                    const response = await fetch(`http://localhost:8080/tictactoe/tictactoeserver/move?key=${gameCode}&tile=${currentPlayer}&y=${Math.floor(clickedCellIndex / 3)}&x=${clickedCellIndex % 3}`);

                    if (!response.ok) {
                        throw new Error(`Failed to execute move: ${response.status}`);
                    }

                    // Update the local gameState and board if the move is successful
                    gameState[clickedCellIndex] = currentPlayer;
                    clickedCell.innerHTML = currentPlayer;
                    updateBoard();

                } catch (error) {
                    console.error('Error executing move:', error.message);
                }
            }

            function handleResultValidation() {
                
                for (let i = 0; i <= 7; i++) {
                    const winCondition = winningConditions[i];
                    const a = gameState[winCondition[0]];
                    const b = gameState[winCondition[1]];
                    const c = gameState[winCondition[2]];
                    if (a === '' || b === '' || c === '')
                        continue;
                    if (a === b && b === c) {
                        roundWon = true;
                        break;
                    }
                }

                if (roundWon) {
                    clearInterval(intervalId);
                    statusDisplay.innerHTML = winningMessage();
                    return;
                }

                const roundDraw = !gameState.includes("");
                if (roundDraw) {
                    clearInterval(intervalId);
                    statusDisplay.innerHTML = drawMessage();
                    return;
                }
            }

            document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));

        } else {
            statusDisplay.innerHTML = gameNotExisting();
        }
    });

});
