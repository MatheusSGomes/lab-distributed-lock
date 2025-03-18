import { createClient } from "redis";
import { MongoClient } from 'mongodb'

const clientRedis = await createClient()
    .on('error', err => console.log('Redis client error', err))
    .connect();

const usuario = 'root';
const senha = 'example';
const host = 'localhost';
const port = '27017';

const url = `mongodb://${usuario}:${senha}@${host}:${port}`;
const clientMongo = new MongoClient(url);
await clientMongo.connect();
const collection = clientMongo.db('meu_banco').collection('reservas');

export async function reservationService(nomePassageiro, numeroAssento) {
    try {
        lockService(numeroAssento);

        const reserva = await collection.findOne({ assento: numeroAssento });

        if (reserva != null) {
            console.log("Assento já reservado, por favor, escolha outro");
            // return false;
        }

        const registro = await collection.insertOne({ nome: nomePassageiro, assento: numeroAssento });
        console.log("Reserva realizada, id: ", registro.insertedId);
        // return true;
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
            console.log("Assento indisponível no momento, por favor, escolha outro ou verifique novamente em 1 minuto");
            return false;
        }

        await clientRedis.set(resource, "true", { EX: ttl, NX: true }); // cria lock por 60 segundos
        return true;
    } catch (error) {
        console.log("Erro ao reservar assento: ", error);
    } finally {
        await clientRedis.disconnect();
    }
}

export async function listReservationSeats() {
    try {
        console.log("Assentos reservados: ");
        const assentosReservados = await collection.find({}, { projection: { _id: 0, nome: 0 }}).sort({ assento: -1 }).toArray();
        console.log(assentosReservados);
    } catch (error) {
        console.log(error)
    } finally {
        await clientMongo.close();
    }
}