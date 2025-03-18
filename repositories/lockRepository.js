import { createClient } from "redis";

const clientRedis = await createClient()
    .on('error', err => console.log('Redis client error', err))
    .connect();

export async function verifySeatIsLockedRepository(seat) {
    const resource = `locks:reservation:${seat}`;
    const value = await clientRedis.get(resource);
    return value == "true";
}

export async function lockSeatRepository(resource) {
    const ttl = 60; // 60 segundos
    await clientRedis.set(resource, "true", { EX: ttl, NX: true }); // cria lock por 60 segundos

    // finally {
    //     await clientRedis.disconnect();
    // }
}