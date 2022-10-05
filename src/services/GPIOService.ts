import rpio from "rpio";
class GPIOService {
    pins: number[];
    constructor() {
        this.pins = [];
        rpio.init({
            close_on_exit: true,
            mock: undefined
        })
    }
    /**
     * @param pins Lista de pinos que serão utilizados na instância
     */
    setPins(pins: number[]) {
        pins.map(pin => rpio.open(pin, rpio.OUTPUT, rpio.LOW));
        this.pins = pins;
    }
    /**
     * 
     * @param pin Numero do pino que será controlado
     * @param state Estado booleano do pino
     */
    write(pin: number, state: boolean) {
        if(!this.pins.includes(pin)) throw new Error("Pino não aberto");
        rpio.write(pin, state ? rpio.HIGH : rpio.LOW);
    }
    
    /**
     * Desabilita todos os pinos da instância
     */
    turnOff() {
        this.pins.map(pin => rpio.write(pin, rpio.LOW));
    }
}

export { GPIOService };