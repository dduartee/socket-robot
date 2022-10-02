import express from "express";
import { GPIOService } from "./services/GPIOService";
import { createServer } from "http";
import { MoveController } from "./controllers/MoveController";
import { Server } from "socket.io";
import stateCache, { MoveState } from "./StateCache";
import path from "path";
import { Light } from "./events/Light";
import { Move } from "./events/Move";
import { StarMove } from "./events/StarMove";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  }
});

app.get('/', function (req, res) { //inicialização da pagina
  res.sendFile(__dirname + '/public/index.html');
  app.use(express.static(path.join(__dirname, 'public')));
});
io.on("connection", socket => {
  socket.onAny(console.log)

  const move = new Move(socket, io);
  socket.on("move", move.execute);

  const starMove = new StarMove(socket, io);
  socket.on("starMove", starMove.execute)
  
  const light = new Light(socket, io);
  socket.on('light', light.execute);

  socket.on('disconnect', () => {
    const moveState = stateCache.get('moveState') as MoveState;
    // se o usuário que desconectou era o último a mover o robô, então desligar os relés
    if (moveState?.invoker === socket.id) move.disconnect()
  });

});

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
