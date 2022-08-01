var controller = require('./controllers');
var router = require('express').Router();

//Connect controller methods to their corresponding routes

router.get('/reviews', controller.get);

router.get('/reviews/meta', controller.getMeta);

router.post('/reviews', controller.post);

router.put('/reviews/:review_id/helpful', controller.put);

module.exports = router;
