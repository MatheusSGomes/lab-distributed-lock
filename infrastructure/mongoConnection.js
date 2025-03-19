import { MongoClient } from 'mongodb';

const usuario = 'root';
const senha = 'example';
const host = 'localhost';
const port = '27017';

const url = `mongodb://${usuario}:${senha}@${host}:${port}`;
const clientMongo = new MongoClient(url);
await clientMongo.connect();

export default clientMongo.db('meu_banco').collection('reservas');