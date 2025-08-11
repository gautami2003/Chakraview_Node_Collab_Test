const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = require('./env.config');
const { createClient } = require('redis');
class RedisClient {
    constructor() {
        if (this.client) {
            return this.client
        }
        else {
            const url = `redis://${REDIS_HOST}:${REDIS_PORT}`;
            this.client = createClient({
                url,
                password: REDIS_PASSWORD
            });
            this.connect();
        }
        this.client.on('error', err => console.log('Redis Client Error', err));
    }

    async connect() {
        await this.client.connect();
        console.log("Redis server connected successfully.")
    }

    async set(key, value, expirationTime) {
        await this.client.set(key, value);

        if (expirationTime) {
            await this.client.expire(key, expirationTime);
        }
    }

    async get(key) {
        const value = await this.client.get(key);
        return value;
    }

    async del(key) {
        const value = await this.client.del(key);
        return value;
    }

    async disconnect() {
        await this.client.disconnect();
    }

}

module.exports = RedisClient