const router = require('express').Router();
const common = require('../libs/common');
const CacheService = require(common.routing('src/business', 'Cache.js'));

// add middleware for each call here
router.route('/')
  .get((req, res) => {
    CacheService.retrieveAllCache().then((data) => {
      common.success(res, data, 'Successfully retrieved cache');
    }).catch((err) => { common.fail(res, err.message); });
  })
  .post((req, res) => {
    if (req.body.key !== undefined) {
      CacheService.createCache(req.body).then((data) => {
        common.success(res, data, 'Successfully created cache');
      }).catch((err) => { common.fail(res, err.message); });
    } else {
      common.fail(res, 'Missing body in request')
    }
  })
  .delete((req, res) => {
    CacheService.deleteAllCache().then((data) => {
      common.success(res, data, 'Successfully deleted cache');
    }).catch((err) => { common.fail(res, err.message); });
  });

router.route('/:key')
  .all((req, res, next) => {
    if (req.params.key === undefined)
      common.fail(res, 'Missing key in request');
    else next();
  })
  .get((req, res) => {
    CacheService.retrieveCache(req.params.key).then((data) => {
      common.success(res, data, 'Successfully retrieved cache key');
    }).catch((err) => { common.fail(res, err.message); });
  })
  .put((req, res) => {
    CacheService.updateCache(req.params.key, req.body.value).then((data) => {
      common.success(res, data, 'Successfully updated cache by key');
    }).catch((err) => { common.fail(res, err.message); });
  })
  .delete((req, res) => {
    CacheService.deleteCache(req.params.key).then((data) => {
      common.success(res, data, 'Successfully deleted cache by key');
    }).catch((err) => { common.fail(res, err.message); });
  })

module.exports = router;
