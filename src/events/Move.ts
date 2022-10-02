import { Server, Socket } from "socket.io";
import { MoveController, moves } from "../controllers/MoveController";
import { GPIOService } from "../services/GPIOService";
import stateCache, { MoveState } from "../StateCache";
import { IEvent } from "./IEvent";

class Move implements IEvent {
    constructor(private socket: Socket, private io: Server) { }
    execute(direction: moves) {
        const gpioService = new GPIOService();
        const moveController = new MoveController(gpioService);
        moveController.move(direction);

        const moveState = {
            direction,
            invoker: this.socket.id,
            timestamp: new Date().toISOString(),
        } as MoveState

        stateCache.del('moveState');
        stateCache.set("moveState", moveState);
        this.io.emit("moveState", moveState);
    }
    disconnect() {
        const gpioService = new GPIOService();

        const moveController = new MoveController(gpioService);
        moveController.move('stop');

        const moveState = {
            direction: 'stop',
            invoker: 'server',
            timestamp: new Date().toISOString(),
        } as MoveState
        stateCache.del('moveState');
        stateCache.set('moveState', moveState);
        this.io.emit('moveState', moveState);
    }
}

export { Move }