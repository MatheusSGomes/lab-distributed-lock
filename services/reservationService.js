import { getAllReservationsRepository, getReservationRepository, registerReservationRepository } from "../repositories/reservationRepository.js";
import { lockSeatRepository, verifySeatIsLockedRepository } from "../repositories/lockRepository.js";

export async function reservationService(nomePassageiro, numeroAssento) {
    try {
        const lockedSeat = lockService(numeroAssento);

        if (lockedSeat) {
            console.log("Assento indisponível no momento, por favor, escolha outro ou verifique novamente em 1 minuto");
        }

        const reservation = await getReservationRepository(numeroAssento);

        if (reservation != null) {
            console.log("Assento já reservado!");
            return false;
        }

        var registerSeat = await registerReservationRepository(nomePassageiro, numeroAssento);
        console.log("Reserva realizada, id: ", registerSeat.insertedId);
        return true;
    } catch (error) {
        console.log("Falha ao reservar assento: ", error);
    }
}

async function lockService(seat) {
    try {
        const resource = `locks:reservation:${seat}`;
        const seatIsLocked = verifySeatIsLockedRepository(resource);

        if (seatIsLocked) {
            return true;
        }

        lockSeatRepository(resource);
        return false;
    } catch (error) {
        console.log("Erro ao reservar assento: ", error);
    }
}

export async function listReservationSeats() {
    console.log("Assentos reservados: ");
    const assentosReservados = await getAllReservationsRepository();
    console.log(assentosReservados);
}
