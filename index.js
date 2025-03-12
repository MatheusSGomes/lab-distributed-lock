import { createClient } from "redis";

const client = await createClient()
    .on('error', err => console.log('Redis client error', err))
    .connect();

await client.set('contador', 0);
client.incr('contador');
client.incr('contador');
client.incr('contador');

const value = await client.get('contador');

console.log(value);

await client.disconnect();