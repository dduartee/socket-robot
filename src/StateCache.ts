import NodeCache from "node-cache";

const stateCache = new NodeCache({ useClones: false });
export default stateCache;

export type MoveState = {
    direction: string;
    invoker: string;
    timestamp: string;
}
export type LightState = {
    state: boolean;
    invoker: string;
    timestamp: string;
}