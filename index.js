import readline from 'readline';
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

async function tryMakeReservation(nomePassageiro, numeroAssento) {
    try {
        const ttl = 60; // 60 segundos
        const resource = `locks:reservation:${numeroAssento}`;

        const value = await clientRedis.get(resource);
        const assentoLock = value == "true";

        if (assentoLock) {
            console.log("Assento indisponível no momento, por favor, escolha outro");
            return false;
        }

        // cria lock por 60 segundos
        await clientRedis.set(resource, "true", { EX: ttl, NX: true });

        const reserva = await collection.findOne({ assento: numeroAssento });

        if (reserva != null) {
            console.log("Assento já reservado, por favor, escolha outro");
            return false;
        }

        const registro = await collection.insertOne({ nome: nomePassageiro, assento: numeroAssento });
        console.log("Reserva realizada, id: ", registro.insertedId);
        return true;
    } catch (error) {
        console.log("Falha ao reservar assento: ", error);
    } finally {
        await clientRedis.disconnect();
        await clientMongo.close();
    }
}

async function listReservationSeats() {
    console.log("Assentos reservados: ");
    const assentosReservados = await collection.find({}, { projection: { _id: 0, nome: 0 }}).sort({ assento: -1 }).toArray();
    console.log(assentosReservados);
}

function initReservation() {
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
        tryMakeReservation(nomePassageiro, reservaAssento);
        listReservationSeats();

        // process.exit(0);
    });
}

initReservation()
