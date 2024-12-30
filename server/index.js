const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

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


io.on("connection", (socket) => {
  console.log("Un utilisateur s'est connecté");
  socket.on("command", (msg) => {
    io.emit("command", msg);
  });
  socket.on("disconnect", () => {
    console.log("Un utilisateur s'est déconnecté");
  });
});


const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
