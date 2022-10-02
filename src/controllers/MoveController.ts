import { GPIOService } from "../services/GPIOService";
export type moves = 'forward' | 'backward' | 'left' | 'right' | 'stop';
class MoveController {
    private relays: Map<string, number>;
    private combinations: Map<string, string[]>;

    constructor(private gpioService: GPIOService) {
        this.relays = new Map([
            ['s1', 40],
            ['s2', 38],
            ['s3', 37],
            ['s4', 36],
        ]);
        this.combinations = new Map<moves, string[]> ([
            ['forward', ['s1', 's2']],
            ['backward', ['s3', 's4']],
            ['left', ['s1', 's4']],
            ['right', ['s2', 's3']],
            ['stop', []],
        ]);
    }
    /**
     * Metodo responsável para desabilitar os outros relés e encontrar a combinação de relés para a direção desejada
     * @param direction Direção para a qual o robô deve se mover
     */
    public move(direction: moves) {
        const pins = Array.from(this.relays.values());
        this.gpioService.setPins(pins);
        this.gpioService.turnOff(); // desliga todos os relés

        const relayCombination = this.combinations.get(direction) || [];
        relayCombination.map(relay => { // habilitar relés para a direção desejada
            const pin = this.relays.get(relay);
            this.gpioService.write(pin, true);
        })
    }
    public async timedMove(direction: moves, seconds: number) {
        return new Promise((resolve) => {
            this.move(direction);
            setTimeout(() => {
                resolve(true);
            }, seconds*1000);
        })
    }
}

export { MoveController }