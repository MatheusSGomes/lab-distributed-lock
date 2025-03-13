import { createClient } from "redis";
import { MongoClient } from 'mongodb'
import { Reserva } from "./Reserva.js";

const clientRedis = await createClient()
    .on('error', err => console.log('Redis client error', err))
    .connect();

await clientRedis.set('contador', 0);
clientRedis.incr('contador');
clientRedis.incr('contador');
clientRedis.incr('contador');

const value = await clientRedis.get('contador');

// console.log(value);

await clientRedis.disconnect();

const usuario = 'root';
const senha = 'example';
const host = 'localhost';
const port = '27017';

const url = `mongodb://${usuario}:${senha}@${host}:${port}`;
const clientMongo = new MongoClient(url);

async function connect() {
    try {
        await clientMongo.connect();
        console.log('Mongo conectado com sucesso')
        return clientMongo.db('meu_banco').collection('minha_colecao');
    } catch (error) {
        console.error("Erro ao conectar", error);
    }
}

async function inserir() {
    const collection = await connect();
    await collection.insertOne({ nome: "João", idade: 30 });
    console.log("Registro inserido!");
}

async function listar() {
    const collection = await connect();
    const registros = await collection.find().toArray();
    console.log(registros);
}

async function editar() {
    const collection = await connect();
    await collection.updateOne({ nome: "João" }, { $set: { idade: 31 } });
    console.log("Registro atualizado!");
}

async function ler() {
    const collection = await connect();
    const registro = await collection.findOne({ nome: "João" });
    console.log(registro);
}

async function apagar() {
    const collection = await connect();
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

function salvarReserva() {
    let nomePassageiro = null;
    let reservaAssento = null;

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

    return new Reserva(nomePassageiro, reservaAssento)
}

console.log("Tentativa de reservar assento: ", salvarReserva());

// Reservar um assento (a23)
// Lock do assento por 15 minutos

// Outro worker tenta reservar o mesmo assento (a23)
// Recebe uma mensagem de erro (quando dentro dos 15 minutos)
// Quando passados 15 minutos (faz nova tentativa, assento está disponível)
