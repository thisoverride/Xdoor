const io = require('socket.io-client');

// Connexion au serveur
const socket = io('http://localhost:3000');


socket.on('connect', () => {
    console.log('Connected to server');
});

// Écoute des réponses du serveur
socket.on('response', (data) => {
    console.log('Server response:', data);
});

function sendCommand(command) {
    console.log('Sending command:', command);
    socket.emit('command', command);
}

socket.on('error', (error) => {
    console.error('Socket error:', error);
});

setTimeout(() => {
    sendCommand('help');
    sendCommand('echo Hello from Node.js!');
}, 1000);
