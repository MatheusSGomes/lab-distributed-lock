import { getResource, setResource } from "../infrastructure/redisConnection.js";

export async function verifySeatIsLockedRepository(resource) {

    const value = await getResource(resource);
    return value == "true";
}

export async function lockSeatRepository(resource) {
    setResource(resource);
}