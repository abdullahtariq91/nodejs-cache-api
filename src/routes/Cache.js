const router = require('express').Router();
const common = require('../libs/common');
const CacheService = require(common.routing('src/business', 'Cache.js'));

// add middleware for each call here
router.route('/')
  .get((req, res) => {
    CacheService.retrieveKeys().then((data) => {
      common.success(res, data, 'Successfully retrieved keys');
    }).catch((err) => { common.fail(res, err.message); })
  })
  .post((req, res) => {
    CacheService.createKey(req.body).then((data) => {
      common.success(res, data, 'Successfully created key');
    }).catch((err) => { common.fail(res, err.message); })
  })
  .delete((req, res) => {
    CacheService.deleteKeys().then((data) => {
      common.success(res, data, 'Successfully deleted keys');
    }).catch((err) => { common.fail(res, err.message); })
  });

router.route('/:key')
  .get((req, res) => {
    CacheService.retrieveKey(req.params.key).then((data) => {
      common.success(res, data, 'Successfully retrieved key');
    }).catch((err) => { common.fail(res, err.message); });
  })
  .put((req, res) => {
    CacheService.updateKey(req.params.key).then((data) => {
      common.success(res, data, 'Successfully updated key');
    }).catch((err) => { common.fail(res, err.message); });
  })
  .delete((req, res) => {
    CacheService.deleteKey(req.params.key).then((data) => {
      common.success(res, data, 'Successfully deleted key');
    }).catch((err) => { common.fail(res, err.message); });
  })

module.exports = router;
