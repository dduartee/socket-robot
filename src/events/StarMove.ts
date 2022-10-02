import { Socket, Server } from "socket.io";
import { MoveController, moves } from "../controllers/MoveController";
import { GPIOService } from "../services/GPIOService";
import stateCache, { MoveState } from "../StateCache";
import { IEvent } from "./IEvent";

class StarMove implements IEvent {
    constructor(private socket: Socket, private io: Server) { }
    /**
     * @param coef Parametro destinado para controlar o angulo de rotação do robô em função do tempo de giro
     */
    async execute(coef: number): Promise<void> {
        const gpioService = new GPIOService();
        const moveController = new MoveController(gpioService);

        const starPattern = [
            { direction: 'left', seconds: 1*coef },
            { direction: 'forward', seconds: 1 },
            { direction: 'right', seconds: 2*coef },
            { direction: 'forward', seconds: 1 },
            { direction: 'left', seconds: 2*coef },
            { direction: 'forward', seconds: 1 },
            { direction: 'backward', seconds: 1 },
            { direction: 'right', seconds: 2*coef },
            { direction: 'forward', seconds: 1 },
        ] as Array<{direction: moves, seconds: number}>;

        for (const move of starPattern) {
            const moveState = {
                direction: move.direction,
                invoker: this.socket.id,
                timestamp: new Date().toISOString(),
            } as MoveState
            this.io.emit("moveState", moveState);
            await moveController.timedMove(move.direction, move.seconds);
        }
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
export { StarMove }