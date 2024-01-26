// document.addEventListener("DOMContentLoaded", function () {

//     var codeElement = document.createElement("p");
//     codeElement.textContent = "Your Game Code: " + gameCode;
//     document.body.appendChild(codeElement);


//     var createButton = document.createElement("button");
//     createButton.className = 'button';
//     createButton.id = "createButton";
//     createButton.textContent = "Go to Game";
//     createButton.addEventListener("click", function () {
//         window.location.href = ('game.html');
//     });
    

//     var checkButton = document.createElement("button");
//     checkButton.className = 'button';
//     checkButton.id = "checkButton";
//     checkButton.textContent = "Check";
//     checkButton.addEventListener("click", function () {
//         check();
//     });
    

//     var resetButton = document.createElement("button");
//     resetButton.className = 'button';
//     resetButton.id = "resetButton";
//     resetButton.textContent = "Reset";
//     resetButton.addEventListener("click", function () {
//         reset();
//     });

//     document.body.appendChild(createButton);
//     document.body.appendChild(checkButton);
//     document.body.appendChild(resetButton);
// });


// function reset() {
//     var resetUrl = `http://localhost:8080/tictactoe/tictactoeserver/reset?key=${gameCode}`;
//     // Make a GET request to the servlet
//     fetch(resetUrl)
//         .then(response => response.json())
//         .then(data => {
//             // Handle the response data here
//             console.log(data);
//         })
//         .catch(error => {
//             console.error(error);
//         });
// }

// function check() {
//     var resetUrl = `http://localhost:8080/tictactoe/tictactoeserver/check?key=${gameCode}`;
//     // Make a GET request to the servlet
//     fetch(resetUrl)
//         .then(response => response.json())
//         .then(data => {
//             // Handle the response data here
//             console.log(data);
//         })
//         .catch(error => {
//             console.error(error);
//         });
// }