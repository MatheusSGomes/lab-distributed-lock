import { createClient } from "redis";

import { getAllReservationsRepository, getReservationRepository, registerReservationRepository } from "../repositories/reservationRepository.js";

const clientRedis = await createClient()
    .on('error', err => console.log('Redis client error', err))
    .connect();

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

        registerReservationRepository(nomePassageiro, numeroAssento);
        console.log("Reserva realizada, id: ", registro.insertedId);
        return true;
    } catch (error) {
        console.log("Falha ao reservar assento: ", error);
    }
}

async function lockService(numeroAssento) {
    try {
        const ttl = 60; // 60 segundos
        const resource = `locks:reservation:${numeroAssento}`;

        const value = await clientRedis.get(resource);
        const assentoLock = value == "true";

        if (assentoLock) {
            return true;
        }

        await clientRedis.set(resource, "true", { EX: ttl, NX: true }); // cria lock por 60 segundos
        return false;
    } catch (error) {
        console.log("Erro ao reservar assento: ", error);
    } finally {
        await clientRedis.disconnect();
    }
}

export async function listReservationSeats() {
    console.log("Assentos reservados: ");
    const assentosReservados = await getAllReservationsRepository();
    console.log(assentosReservados);
}
