import NodeCache from "node-cache";

const stateCache = new NodeCache({ stdTTL: 0, checkperiod: 0, useClones: false });
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