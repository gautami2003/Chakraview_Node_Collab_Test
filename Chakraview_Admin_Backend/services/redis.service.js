const RedisClient = require('../configs/redis.config');
const redis = new RedisClient();

const setRedisValue = async (key, value, expirationTime = 150) => {
    if (await redis.set(key, value, expirationTime)) {
        // console.log(`Redis KEY:- ${key} VALUE:- ${value} set successfully.`);
        // console.log("------------------------");
        return true
    } else {
        // console.log(`Failed to set Redis key ${key}`);
        // console.log("------------------------");
        return false
    }
}

const getRedisValue = async (key) => {
    const value = await redis.get(key);
    // console.log(`Reading key:- ${key} from redis.`);
    // console.log(`VALUE ${value} for KEY ${key} from redis.`);
    // console.log("------------------------");

    return value
}

const deleteFromRedis = async (key) => {
    const deletedCount = await redis.del(key);
    return deletedCount > 0;
};

const checkRedisKeyExists = async (key) => {
    const keyExists = await getRedisValue(key);
    console.log(keyExists);
    return keyExists > 0;
};

module.exports = {
    setRedisValue,
    getRedisValue,
    deleteFromRedis,
    checkRedisKeyExists
}