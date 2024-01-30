document.addEventListener("DOMContentLoaded", function () {

    var gameCode;
    var playerTile;
    async function checkGameExistence() {
        console.log("checking " + gameCode);
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

    async function createGame() {
        console.log("Creating " + gameCode);
        try {

            fetch(`http://localhost:8080/tictactoe/tictactoeserver/createGame?key=${gameCode}`)
                .then(res => res.text())
                .then(data => {
                    console.log("DATA: " + data);
                    playerTile = data;
                    console.log("PlayerTile: " + playerTile);
                });



        } catch (error) {
            console.error("Error creating game:", error.message);
        }
    }

    function reset() {
        console.log("Resetting " + gameCode);
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

    function createPopUp() {
        // Create the popup div
        var popupDiv = document.createElement('div');
        popupDiv.id = 'popup';
        popupDiv.style.display = 'none';

        // Create the paragraph for the popup text
        var popupText = document.createElement('p');
        popupText.id = 'popupText';

        // Create the close button for the popup
        var closePopupBtn = document.createElement('button');
        closePopupBtn.id = 'closePopup';
        closePopupBtn.textContent = 'Close';

        // Append the paragraph and button to the popup div
        popupDiv.appendChild(popupText);
        popupDiv.appendChild(closePopupBtn);

        // Append the popup div to the document body
        document.body.appendChild(popupDiv);
    }

    function createModal(modalId, h2Text, placeholder) {
        var overlayDiv = document.createElement('div');
        overlayDiv.className = 'overlay';
        overlayDiv.id = 'overlay';

        var modalContentDiv = document.createElement('div');
        modalContentDiv.className = 'modal';
        modalContentDiv.id = modalId;

        var h2Element = document.createElement('h2');
        h2Element.innerHTML = h2Text;

        var userInput = document.createElement("input");
        userInput.type = "text";
        userInput.placeholder = placeholder;
        userInput.id = "userInput";

        var btnDiv = document.createElement('div');
        btnDiv.className = 'button-container';

        var cancelBtn = document.createElement('button');
        cancelBtn.className = 'sub-can-btn button';
        cancelBtn.type = 'reset';
        cancelBtn.formNoValidate = true;
        cancelBtn.innerHTML = 'Cancel';
        cancelBtn.onclick = function () {
            userInput.value = '';
            closeModal(modalId);
        };

        var submitBtn = document.createElement('button');
        submitBtn.className = 'sub-can-btn button';
        submitBtn.type = 'submit';
        submitBtn.innerHTML = 'Submit';

        // Add an event listener to the submit button
        submitBtn.addEventListener('click', async function (event) {
            var inputValue = userInput.value.trim();
            if (userInput == null) {
                inputValue = generateGameCode();
            }
            gameCode = inputValue;
            var gameExists = await checkGameExistence();
            // Check if the response from the servlet is true
            if (gameExists === true) {
                codeText.innerHTML = 'SPECTATOR';
                closeModal(modalId);
            } else {
                if (playerTile == null) {
                    createGame();
                    userInput.value = '';
                    codeText.innerHTML = `CODE: ${gameCode}`;
                    closeModal(modalId);
                }
                else {
                    var popup = document.getElementById('popup');
                    var popupText = document.getElementById('popupText');
                    var closePopupBtn = document.getElementById('closePopup');
    
                    popupText.innerText = "You are in a game";
                    popup.style.display = 'block';
    
                    // Close the popup when the close button is clicked
                    closePopupBtn.addEventListener('click', function () {
                        popup.style.display = 'none';
                    });
                }
            }
        });

        btnDiv.appendChild(cancelBtn);
        btnDiv.appendChild(submitBtn)

        modalContentDiv.appendChild(h2Element);
        modalContentDiv.appendChild(userInput);
        modalContentDiv.appendChild(btnDiv);

        document.body.appendChild(overlayDiv);
        document.body.appendChild(modalContentDiv);
    }

    function openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
    }

    function closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    }


    createModal("createModal", "Enter Game Code", "(Auto-generate if empty)", true);
    // createModal("joinModal", "Enter Game", "Enter Game Code", false);
    createPopUp();



    // Create section element
    const section = document.createElement('section');

    // Create h1 element with class "game--title"
    const h1 = document.createElement('h1');
    h1.className = 'game--title';
    h1.textContent = 'Tic-Tac-Toe';

    // Create h2 element with class "game--status"
    const codeText = document.createElement('h2');
    codeText.className = 'game--subtitle';
    codeText.innerHTML = "CODE";

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

    // Create create button
    const createButton = document.createElement('button');
    createButton.className = 'game-button crt-btn';
    createButton.textContent = 'Create/Join';

    // Create reset button
    const resetButton = document.createElement('button');
    resetButton.className = 'game-button rst-btn';
    resetButton.textContent = 'Reset';

    // Create start button
    const startButton = document.createElement('button');
    startButton.className = 'game-button start-btn';
    startButton.textContent = 'Start';

    // Append all elements to the section
    section.appendChild(h1);
    section.appendChild(codeText);
    section.appendChild(gameContainer);
    section.appendChild(h2);
    section.appendChild(createButton);

    section.appendChild(resetButton);
    section.appendChild(startButton);

    // Append the section to the body of the HTML document
    document.body.appendChild(section);



    const statusDisplay = document.querySelector('.game--status');

    const welcome = () => `Welcome to Tic Tac Toe`;
    const noGame = () => `No Game to Reset`;
    const gameNotExisting = () => `Game is not existing`;
    const gameReset = () => `Game was Reset`;
    const gameIsReady = () => `Game is Ready. Press Start.`;


    statusDisplay.innerHTML = welcome();

    var intervalId;


    document.querySelector('.crt-btn').addEventListener('click', async () => {
        clearInterval(intervalId);
        if (gameCode == null || gameCode == ''){
            openModal("createModal");
        }
        else{
            createGame();
        }
    });


    document.querySelector('.rst-btn').addEventListener('click', async () => {
        clearInterval(intervalId);
        const gameExists = await checkGameExistence();

        if (gameExists) {
            reset();
            statusDisplay.innerHTML = gameReset();
        } else {
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
