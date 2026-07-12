const { createClient } = require("redis");
const config = require("../config/env");

const redis = createClient({
  url: config.redis.url,
});

module.exports = redis;