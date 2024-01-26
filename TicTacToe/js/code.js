export var key;

function generateGameCode() {
    // Generate a random 6-digit code
    // var code = Math.floor(100000 + Math.random() * 900000);
    var code = '123456';
    key = code;
}

function getGeneratedCode(){
    return key;
}