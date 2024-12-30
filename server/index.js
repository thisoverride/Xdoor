const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


app.use(cors());
app.use(express.static("public"));

const executors = {}; 
const senders = {}; 
const userInfo = os.userInfo();

io.on("connection", (socket) => {

  socket.on("register", ({ type, userId }) => {
    console.log(type)
    if (type === "executor") {
      executors.id = socket.id;

      console.log(`${type} OK -> ${socket.id}`);
    } else if (type === "X-SENDER") {
      senders.id = socket.id;
      io.to(socket.id).emit('os:info', userInfo.username)
      console.log(`${type} OK -> ${socket.id}`);
    }
  });




  socket.on("command", ({ type, command }) => {
    const senderId = socket.id;
    console.log('emitter', senderId)
    const executorSocketId = executors.id;
    io.to(executorSocketId).emit("execute", { senderId ,type, command });
    // if (executorSocketId) {
    // } else {
    //   socket.emit("response", `Exécuteur avec ID ${executorId} introuvable.`);
    // }
  });


  socket.on("result", ({ senderId, result }) => {
    console.log(result);  // Vérifiez que vous obtenez bien le résultat ici
    
    // Assurez-vous que l'ID du sender est correctement utilisé
    io.to(senderId).emit("response", result);  // Émettre la réponse à l'émetteur
    
    // Si le senderId n'est pas trouvé
    if (!senderId) {
      console.log(`Émetteur avec ID ${senderId} introuvable.`);
    }
  });
  

  socket.on("disconnect", () => {
    console.log(`Client déconnecté : ${socket.id}`);
    for (const [key, value] of Object.entries(executors)) {
      if (value === socket.id) {
        delete executors[key];
        console.log(`Exécuteur supprimé : ${key}`);
        break;
      }
    }
    for (const [key, value] of Object.entries(senders)) {
      if (value === socket.id) {
        delete senders[key];
        console.log(`Émetteur supprimé : ${key}`);
        break;
      }
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
