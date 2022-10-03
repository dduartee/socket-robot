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
  // socket.onAny(console.log)

  socket.on("move", (direction) => {
    const move = new Move(socket, io);
    move.execute(direction)
  });

  socket.on("starMove", () => {
    const starMove = new StarMove(socket, io);
    starMove.execute()
  })
  
  
  socket.on('light', (state) => {
    const light = new Light(socket, io);
    light.execute(state)
});

  socket.on('disconnect', () => {
    const move = new Move(socket, io);
    const moveState = stateCache.get('moveState') as MoveState;
    // se o usuário que desconectou era o último a mover o robô, então desligar os relés
    if (moveState?.invoker === socket.id) move.disconnect()
  });

});

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
