# Socket-robot
> Este repositorio é um remake do meu projeto anterior [_robot-rpi-wireless_][robot-rpi-wireless], onde é utilizado _ajax_ para comunicação, _php_ para executar comandos e _python_ para acionar os pinos do Raspberry Pi.

> O outro repositorio tambem é funcional! mas por questões de curiosidade estou fazendo esse novo repositorio utilizando o _nodejs_ com _socket.io_ para execução de comandos, que tenho certeza que será melhor do que o anterior.
<br>
O projeto é uma integração de um frontend executando comandos através do socket.io , o socket.io permite comunicação em tempo real entre o frontend com o backend em nodejs.<br>
O frontend é bem simples, responsivo, sem muita estilização, e simplesmente quando acionado o botão ele chama uma função que identifica qual botão está chamando e emite para o backend qual comando deverá ser executado.
Este comando, acionará os pinos do Raspberry Pi, acionando relés especificos que estarão ligados em motores do robo.

## Instalação das dependências

O projeto conta com as dependencias "_path, express, http_ e _socket.io_"
Para instalar elas, é possivel instalar todas manualmente com:
```sh
npm install <dependencia>
```
Mas para instalar todas as dependencias de forma automatizada pode se usar o comando:
```sh
npm install
```

## Inicialização

Para executar o script do projeto, usa-se os comandos:

Para *desenvolvimento* com nodemon:
```sh
npm dev start
```

Inicialização sem nodemon:
```sh
npm start
```

## Histórico de versões
* 0.1.0
    * Mudança: Inicialização do projeto, sem execução de comandos, somente backend. (07/06/2020)
    
[robot-rpi-wireless]: https://github.com/dduartee/robot-rpi-wireless
