import { createClient } from "redis";
import { MongoClient } from 'mongodb'

const clientRedis = await createClient()
    .on('error', err => console.log('Redis client error', err))
    .connect();

await clientRedis.set('contador', 0);
clientRedis.incr('contador');
clientRedis.incr('contador');
clientRedis.incr('contador');

const value = await clientRedis.get('contador');

console.log(value);

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

async function listar() {
    const collection = await connect();
    const registros = await collection.find().toArray();
    console.log(registros);
}

listar();


/*connect()
    .then(console.log)
    .catch(console.error)
     .finally(() => clientMongo.close()) */;
