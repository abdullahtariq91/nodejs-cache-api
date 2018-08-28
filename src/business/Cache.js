const common = require('../libs/common');
const cacheModel = require(common.routing('src/models', 'Cache.js'));
const maximumRecords = require('../configurations/default').recordsAllowed;
const ttl = require('../configurations/default').ttl;

// private functions
// ToDo: move private functions to separate folder
const getExpirationDate = (date) => {
  return new Date(date.getTime() + (ttl * 1000));
};

const saveCache = (param) => {
  return new Promise((resolve, reject) => {
    let cacheObj = {};
    cacheObj.key = param.key;
    if (param.value) {
      cacheObj.value = param.value;
    } else {
      cacheObj.value = common.random();
    }
    cacheObj.updatedDate = new Date();
    cacheObj.createdDate = new Date();
    cacheObj.expirationDate = getExpirationDate(new Date());

    cacheModel.countDocuments({}).then((total) => {
      if (maximumRecords < 1) {
        return reject({ message: 'No entries allowed' });
      }

      if (!total || total < maximumRecords) {
        cacheModel.create(cacheObj).then((cache) => {
          if (!cache) {
            return reject({ message: 'Failed to create cache' });
          }
          return resolve(cache);
        }).catch((err) => {
          return reject({ message: err.message });
        });
      } else {
        // find the oldest record, and overwrite it
        cacheModel.findOneAndUpdate(
          {},
          cacheObj,
          { 
            sort: { createdDate: 1 },
            upsert: true,
            new: true
          }).then((cache) => {
          if (!cache) {
            return reject({ message: 'Failed to create cache' });
          }
          return resolve(cache);
        }).catch((err) => {
          return reject({ message: err.message });
        });
      }
    });
  });  
}

// public functions
const retrieveAllCache = () => {
  return new Promise((resolve, reject) => {
    cacheModel.find({}).then((data) => {
      if (!data) {
        return reject({ message: 'Failed to find cache' });
      } else {
        return resolve(data);
      }
    }).catch((err) => {
      return reject({ message: err.message });
    });
  });
};

const createCache = (param) => {
  return saveCache(param);
};

const deleteAllCache = () => {
  return new Promise((resolve, reject) => {
    cacheModel.deleteMany({}).then((data) => {
      if (!data) {
        return reject({ message: 'Failed to delete cache' });
      } else {
        return resolve(data);
      }
    }).catch((err) => {
      return reject({ message: err.message });
    });
  });
};

const retrieveCache = (param) => {
  return new Promise((resolve, reject) => {
    let expirationDate = getExpirationDate(new Date());
    cacheModel.findOneAndUpdate(
      { key: param, expirationDate: { $gt: new Date() } },
      { expirationDate }
    ).then((data) => {
      if (!data) {
        console.log('Cache miss');
        return resolve(saveCache({ key: param }));
      } else {
        console.log('Cache hit');
        return resolve(data);
      }
    }).catch((err) => {
      return reject({ message: err.message });
    });
  });
};

const updateCache = (param) => {
  return new Promise((resolve, reject) => {
    return resolve({ something: 'param' });
  });
};

const deleteCache = (param) => {
  return new Promise((resolve, reject) => {
    cacheModel.deleteOne({ key: param }).then((data) => {
      if (!data) {
        return reject({ message: 'Failed to delete cache by key' });
      } else {
        if (data.n === 0) {
          return reject({ message: 'No record found' });
        } else {
          return resolve(data);
        }
      }
    }).catch((err) => {
      return reject({ message: err.message });
    });
  });
};

module.exports = {
  retrieveAllCache,
  retrieveCache,
  createCache,
  updateCache,
  deleteAllCache,
  deleteCache
};