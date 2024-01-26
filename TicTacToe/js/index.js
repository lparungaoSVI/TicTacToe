document.addEventListener("DOMContentLoaded", function () {

    // Create the Start Game button
    var createGame = document.createElement("button");
    createGame.className = 'button';
    createGame.id = "createGame";
    createGame.textContent = "Create Game";


    // Create the Join Game button
    var joinButton = document.createElement("button");
    joinButton.className = 'button';
    joinButton.id = "joinButton";
    joinButton.textContent = "Join Game";


    // Append the buttons to the body element
    document.body.appendChild(createGame);
    document.body.appendChild(joinButton);

    
});