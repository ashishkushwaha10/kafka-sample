const router = require('express').Router();
const testRoute = require('./test.route');

router.use('/test', testRoute);


module.exports = router;