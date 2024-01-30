var gameCode;
document.addEventListener("DOMContentLoaded", function () {
    // Create the Start Game button
    var createGameButton = document.createElement("button");
    createGameButton.className = 'button';
    createGameButton.id = "createGame";
    createGameButton.textContent = "Create Game";
    createGameButton.addEventListener("click", function () {
        gameCode = generateGameCode();
        localStorage.setItem('gameCode', gameCode);
        createGame();
        window.location.href = 'game.html';
    });


    // Create the Join Game button
    var joinButton = document.createElement("button");
    joinButton.className = 'button';
    joinButton.id = "joinButton";
    joinButton.textContent = "Join Game";
    joinButton.addEventListener("click", function () {
        openModal();
    });

    document.body.appendChild(createGameButton);
    document.body.appendChild(joinButton);

    createModal();

});

function createModal() {
    var overlayDiv = document.createElement('div');
    overlayDiv.className = 'overlay';
    overlayDiv.id = 'overlay';

    var modalContentDiv = document.createElement('div');
    modalContentDiv.className = 'modal';
    modalContentDiv.id = "myModal"

    var h2Element = document.createElement('h2');
    h2Element.innerHTML = 'Enter Game Code';

    var userInput = document.createElement("input");
    userInput.type = "text";
    userInput.id = "userInput";

    var btnDiv = document.createElement('div');
    btnDiv.className = 'button-container';

    var cancelBtn = document.createElement('button');
    cancelBtn.className = 'sub-can-btn button';
    cancelBtn.type = 'reset';
    cancelBtn.formNoValidate = true;
    cancelBtn.innerHTML = 'Cancel';
    cancelBtn.onclick = closeModal;

    var submitBtn = document.createElement('button');
    submitBtn.className = 'sub-can-btn button';
    submitBtn.type = 'submit';
    submitBtn.innerHTML = 'Submit';

    // Add an event listener to the submit button
    submitBtn.addEventListener('click', function (event) {
        handleJoinButtonClick();
        closeModal();

    });


    btnDiv.appendChild(cancelBtn);
    btnDiv.appendChild(submitBtn)

    modalContentDiv.appendChild(h2Element);
    modalContentDiv.appendChild(userInput);
    modalContentDiv.appendChild(btnDiv);

    document.body.appendChild(overlayDiv);
    document.body.appendChild(modalContentDiv);
}

function openModal() {
    document.getElementById('myModal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closeModal() {
    document.getElementById('myModal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function handleJoinButtonClick() {
    var userInput = document.getElementById("userInput").value;
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

function generateGameCode() {
    // Generate a random 6-digit code
    // var code = Math.floor(100000 + Math.random() * 900000);
    var code = '123456';
    return code;
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