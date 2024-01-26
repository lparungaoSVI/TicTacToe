var gameCode;

document.addEventListener("DOMContentLoaded", function () {

    // Create the Start Game button
    var createGameButton = document.createElement("button");
    createGameButton.className = 'button';
    createGameButton.id = "createGame";
    createGameButton.textContent = "Create Game";
    createGameButton.addEventListener("click", function () {
        generateGameCode();
        gameCode = getGeneratedCode();
        createGame();
        window.location.href = 'game.html';
    });


    // Create the Join Game button
    var joinButton = document.createElement("button");
    joinButton.className = 'button';
    joinButton.id = "joinButton";
    joinButton.textContent = "Join Game";
    joinButton.addEventListener("click", function () {
        handleJoinButtonClick();
    });


    // Append the buttons to the body element
    document.body.appendChild(createGameButton);
    document.body.appendChild(joinButton);

});

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