const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cacheObj = new Schema({
  key: { type: String, unique: true },
  value: { type: String },
  createdDate: { type: Date },
  updatedDate: { type: Date },
  expirationDate: { type: Date }
});

module.exports = mongoose.model('Cache', cacheObj);