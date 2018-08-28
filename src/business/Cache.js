const common = require('../libs/common.js');
// const cacheModel = require(common.routing('src/models', 'Cache.js'));

const retrieveKeys = () => {
  return new Promise((resolve, reject) => {
    return resolve({ something: 'something' });
  });
};

const createKey = (param) => {
  return new Promise((resolve, reject) => {
    return resolve({ something: param });
  });
};

const deleteKeys = () => {
  return new Promise((resolve, reject) => {
    return resolve({ something: body });
  });
};

const retrieveKey = (param) => {
  return new Promise((resolve, reject) => {
    return resolve({ something: param });
  });
};

const updateKey = (param) => {
  return new Promise((resolve, reject) => {
    return resolve({ something: param });
  });
};

const deleteKey = (param) => {
  return new Promise((resolve, reject) => {
    return resolve({ something: param });
  });
};

module.exports = {
  retrieveKeys,
  retrieveKey,
  createKey,
  updateKey,
  deleteKeys,
  deleteKey
};