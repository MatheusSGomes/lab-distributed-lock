import { MongoClient } from 'mongodb';

const usuario = 'root';
const senha = 'example';
const host = 'localhost';
const port = '27017';

const url = `mongodb://${usuario}:${senha}@${host}:${port}`;
const clientMongo = new MongoClient(url);
await clientMongo.connect();
const collection = clientMongo.db('meu_banco').collection('reservas');

export async function getReservationRepository(numeroAssento) {
    try {
        return await collection.findOne({ assento: numeroAssento });
    } catch (error) {
        console.log(error);
    } /* finally {
        await clientMongo.close();
    } */
}

export async function registerReservationRepository(nomePassageiro, numeroAssento) {
    try {
        await collection.insertOne({ nome: nomePassageiro, assento: numeroAssento });
    } catch (error) {
        console.log(error);
    } /* finally {
        await clientMongo.close();
    } */
}

export async function getAllReservationsRepository() {
    try {
        return await collection.find({}, { projection: { _id: 0, nome: 0 } }).sort({ assento: -1 }).toArray();
    } catch (error) {
        console.log(error);
    } /* finally {
        await clientMongo.close();
    } */
}