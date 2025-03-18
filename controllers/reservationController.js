import readline from 'readline';
import { reservationService, listReservationSeats } from '../services/reservationService.js';

export default function reservationController() {
    let nomePassageiro, reservaAssento;

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

    rl.question('Qual é o seu nome? ', function (name) {
        console.log('Name: ', name)
        nomePassageiro = name;

        rl.question('Assento desejado de A a G, de 1 a 23. Ex: g23? ', function (seat) {
            console.log('Seat: ', seat, '\n')
            reservaAssento = seat ;
            rl.close();
        })
    });

    rl.on('close', function () {
        reservationService(nomePassageiro, reservaAssento);
        listReservationSeats();

        // process.exit(0);
    });
}
