import { Server, Socket } from "socket.io";
import  {GPIOService}  from "../services/GPIOService";
import stateCache, { LightState } from "../StateCache";
import { IEvent } from "./IEvent";

class Light implements IEvent {
    constructor(private socket: Socket, private io: Server) { }
    execute(state: boolean): void {
        const gpioService = new GPIOService();
        const pin = 32;
        gpioService.setPins([pin])
        gpioService.write(pin, state);
        stateCache.del('lightState');
        const lightState = {
            state,
            invoker: this.socket.id,
            timestamp: new Date().toISOString(),
        } as LightState
        stateCache.set("lightState", lightState)
        this.io.emit('lightState', lightState);
        return;
    }
}

export { Light }