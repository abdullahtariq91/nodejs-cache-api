module.exports = {
  database: {
    development : 'mongodb://127.0.0.1:27017/nodejs-cache',
    production  : ''
  },
  recordsAllowed: 5,
  ttl: 120
}