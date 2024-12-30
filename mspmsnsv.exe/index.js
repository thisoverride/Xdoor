const io = require('socket.io-client');
const { exec } = require('child_process');

const socket = io('http://localhost:3000');


socket.on('connect', () => {
    console.log('Connected to server');
    
    socket.emit('register', { type: 'executor'});
});


socket.on('execute', (data) => {
    const { senderId, type, command } = data;
    console.log(`Received command from ${senderId} type: ${type} : ${command}`);

    exec(command, (error, stdout, stderr) => {
        let result;

        if (error) {
            result = `${error.message}`;
        } else if (stderr) {
            result = `${stderr}`;
        } else {
            result = `${stdout}`;
        }

        console.log(`Sending response to ${senderId}: ${result}`);

        socket.emit('result', { senderId, result });
    });
});



socket.on('error', (error) => {
    console.error('Socket error:', error);
});
