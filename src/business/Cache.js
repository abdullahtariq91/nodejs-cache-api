const common = require('../libs/common');
const cacheModel = require(common.routing('src/models', 'Cache.js'));
const maximumRecords = require('../configurations/default').recordsAllowed;
const ttl = require('../configurations/default').ttl;

// private functions
// ToDo: move private functions to separate folder
const getExpirationDate = (date) => {
  return new Date(date.getTime() + (5 * 1000));
};

const saveCache = (param) => {
  return new Promise((resolve, reject) => {
    if (maximumRecords < 1) {
      return reject({ message: 'No entries allowed' });
    }
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
      // check if maximum records have been reached
      if (!total || total + 1 <= maximumRecords) {
        cacheModel.create(cacheObj).then((cache) => {
          if (!cache) {
            return reject({ message: 'Failed to create cache' });
          }
          return resolve(cache);
        }).catch((err) => {
          return reject({ message: err.message });
        });
      } else {
        // find record with oldest expiration date, and overwrite it
        // assumption: newest expiration date is either new record
        // or record being hit regularly
        cacheModel.findOneAndUpdate(
          {},
          cacheObj,
          { 
            sort: { expirationDate: 1 },
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
    // retrieves all cache - expired or not
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
    // deletes all cache
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
    // retrieves and updates cache if it has not expired
    cacheModel.findOneAndUpdate(
      { key: param, expirationDate: { $gt: new Date() } },
      { expirationDate }
    ).then((data) => {
      if (!data) {
        console.log('Cache miss');
        // delete record if cache has expired
        cacheModel.deleteOne({ key: param }).then((data) => {
          if (!data) {
            return reject({ message: 'Failed to delete cache by key' });
          } else {
            // create and returns new cache
            return resolve(saveCache({ key: param }));
          }
        }).catch((err) => {
          return reject({ message: err.message });
        });
      } else {
        console.log('Cache hit');
        return resolve(data);
      }
    }).catch((err) => {
      return reject({ message: err.message });
    });
  });
};

const updateCache = (key, value) => {
  return new Promise((resolve, reject) => {
    let expirationDate = getExpirationDate(new Date());
    // update cache only if it has NOT expired
    // assumption: 'If the TTL is exceeded, the cached data will not be used'
    cacheModel.findOneAndUpdate(
      { key,
        expirationDate: { $gt: new Date() }
      },
      {
        value,
        expirationDate,
        updatedDate: new Date() 
      },
      { 
        new: true
      }).then((cache) => {
      if (!cache) {
        return reject({ message: 'Failed to update cache' });
      }
      return resolve(cache);
    });
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