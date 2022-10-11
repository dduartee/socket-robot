import rpio from "rpio";
class GPIOService {
    pins: number[];
    constructor(private rpioInstance: typeof rpio) {
        this.pins = [];
    }
    /**
     * @param pins Lista de pinos que serão utilizados na instância
     */
    setPins(pins: number[]) {
        pins.map(pin => this.rpioInstance.open(pin, this.rpioInstance.OUTPUT, this.rpioInstance.LOW));
        this.pins = pins;
    }
    /**
     * 
     * @param pin Numero do pino que será controlado
     * @param state Estado booleano do pino
     */
    write(pin: number, state: boolean) {
        if(!this.pins.includes(pin)) throw new Error("Pino não aberto");
        this.rpioInstance.write(pin, state ? this.rpioInstance.HIGH : this.rpioInstance.LOW);
    }
    
    /**
     * Desabilita todos os pinos da instância
     */
    turnOff() {
        this.pins.map(pin => this.rpioInstance.write(pin, this.rpioInstance.LOW));
    }
}

export { GPIOService };