const socket = io('http://localhost:3000');
const input = document.getElementById('input');
const sendButton = document.getElementById('send');
const terminalOutput = document.getElementById('terminal-output');
let currentUser = "";

socket.emit("register", { type: "X-SENDER" });

socket.on('os:info', (userInfo) => {
    currentUser = userInfo
    addOutput(">>>> Hello my friend it's not good to be here be careful my friend :) <<<<")
});

function addOutput(text) {
    const li = document.createElement('li');
    li.textContent = text;
    terminalOutput.appendChild(li);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function handleCommand(command) {
    addOutput(`${currentUser} $ ${command}`);
    socket.emit('command', { type: "X-SENDER", command });
}

socket.on('response', (result) => {
    addOutput(result);
});

sendButton.addEventListener('click', () => {
    const command = input.value.trim();
    if (command) {
        handleCommand(command);
        input.value = '';  // Effacer après envoi
    }
});

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        sendButton.click();
    }
});
