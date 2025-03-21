import mongoConnection from "../infrastructure/mongoConnection.js";

export async function getReservationRepository(numeroAssento) {
    try {
        return await mongoConnection.findOne({ assento: numeroAssento });
    } catch (error) {
        console.log(error);
    }
}

export async function registerReservationRepository(nomePassageiro, numeroAssento) {
    try {
        return await mongoConnection.insertOne({ nome: nomePassageiro, assento: numeroAssento });
    } catch (error) {
        console.log(error);
    }
}

export async function getAllReservationsRepository() {
    try {
        return await mongoConnection.find({}, { projection: { _id: 0, nome: 0 } }).sort({ assento: -1 }).toArray();
    } catch (error) {
        console.log(error);
    }
}