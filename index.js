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
var collection = clientMongo.db('meu_banco').collection('reservas');

async function tryMakeReservation(nomePassageiro, numeroAssento) {
    try {
        const ttl = 60; // 60 segundos
        const resource = `locks:reservation:${numeroAssento}`;

        const value = await clientRedis.get(resource);
        const assentoLock = value == "true";

        if (assentoLock) {
            throw new Error("Assento indisponível no momento");
        }

        // cria lock
        await clientRedis.set(resource, "true", { EX: ttl, NX: true });

        const reserva = await collection.findOne({ nome: nomePassageiro, assento: numeroAssento });

        if (reserva != null) {
            throw new Error("Assento reservado");
        }

        const registro = await collection.insertOne({ nome: nomePassageiro, assento: numeroAssento });
        console.log("Reserva realizada, id: ", registro.insertedId);

    } catch (error) {
        console.log("Falha ao reservar assento: ", error);
    } finally {
        await clientRedis.disconnect();
        await clientMongo.close();
    }
}

async function inserir() {
    await collection.insertOne({ nome: "João", idade: 30 });
    console.log("Registro inserido!");
}

async function listar() {
    const registros = await collection.find().toArray();
    console.log(registros);
}

async function editar() {
    await collection.updateOne({ nome: "João" }, { $set: { idade: 31 } });
    console.log("Registro atualizado!");
}

async function ler() {
    const registro = await collection.findOne({ nome: "João" });
    console.log(registro);
}

async function apagar() {
    await collection.deleteOne({ nome: "João" });
    console.log("Registro apagado!");
}


// ler();
// editar();
// inserir();
// listar();
// apagar();

/*connect()
    .then(console.log)
    .catch(console.error)
     .finally(() => clientMongo.close()) */;

const args = process.argv.slice(2);

const ARG_PASSAGEIRO = "--passageiro";
const ARG_ASSENTO = "--assento";

function initReservation() {
    let nomePassageiro = null;
    let reservaAssento = null;

    if (args.length == 0) {
        return null;
    }

    args.forEach(arg => {
        const [key, value] = arg.split("=");

        switch (key) {
            case ARG_PASSAGEIRO:
                nomePassageiro = value
                break;

            case ARG_ASSENTO:
                reservaAssento = value
                break;
            default:
                break;
        }
    })

    tryMakeReservation(nomePassageiro, reservaAssento);
}
initReservation()
