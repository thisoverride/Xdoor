const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Autoriser toutes les origines (ou spécifiez une origine particulière)
        methods: ['GET', 'POST']
    }
});

// Activer CORS pour les requêtes HTTP
app.use(cors());

// Servir les fichiers statiques (si applicable)
app.use(express.static('public'));

// Gérer les connexions Socket.IO
io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté');
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté');
    });
});

// Lancer le serveur
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
