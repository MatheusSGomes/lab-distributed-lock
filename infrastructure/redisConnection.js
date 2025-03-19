import { createClient } from "redis";

const clientRedis = await createClient()
    .on('error', err => console.log('Redis client error', err))
    .connect();

export async function getResource(resource) {
    return await clientRedis.get(resource);
}

export async function setResource(resource) {
    const ttl = 60; // 60 segundos
    await clientRedis.set(resource, "true", { EX: ttl, NX: true }); // cria lock por 60 segundos
}
