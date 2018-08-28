const router = require('express').Router();
const common = require('../libs/common');

// add middleware for each call here
router.route('/test')
  .get((req, res) => {
    common.success(res, 'Hi!');
  });

module.exports = router;