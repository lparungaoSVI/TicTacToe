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

    // Create initialize button
    const resetButton = document.createElement('button');
    resetButton.className = 'game-button rst-btn';
    resetButton.textContent = 'Reset';

    // Create restart button
    const startButton = document.createElement('button');
    startButton.className = 'game-button start-btn';
    startButton.textContent = 'Start';

    // Append all elements to the section
    section.appendChild(h1);
    section.appendChild(gameContainer);
    section.appendChild(h2);
    section.appendChild(resetButton);
    section.appendChild(startButton);

    // Append the section to the body of the HTML document
    document.body.appendChild(section);

    const statusDisplay = document.querySelector('.game--status');

let gameActive = true;
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

// Function to initialize the game state from local storage
function initializeGame() {
    const storedGameState = localStorage.getItem('ticTacToeGameState');
    if (storedGameState) {
        gameState = JSON.parse(storedGameState);
        updateBoard();
        handleResultValidation();
    }
}

// Function to update the game state in local storage
function updateLocalStorage() {
    localStorage.setItem('ticTacToeGameState', JSON.stringify(gameState));
}

// Function to update the game board based on the current game state
function updateBoard() {
    document.querySelectorAll('.cell').forEach((cell, index) => {
        cell.innerHTML = gameState[index];
    });
}

statusDisplay.innerHTML = currentPlayerTurn();
initializeGame(); // Initialize the game state from local storage


function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
    updateLocalStorage(); // Update local storage after each move
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
    let roundWon = false;
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
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

    const roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive)
        return;

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    updateLocalStorage(); // Update local storage on game restart
    updateBoard(); // Update the game board on restart
}

// Listen for the storage event to update game state in other tabs
window.addEventListener('storage', (event) => {
    if (event.key === 'ticTacToeGameState') {
        initializeGame();
    }
});

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.rst-btn').addEventListener('click', handleRestartGame);

});