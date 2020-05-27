"use strict";

const router = require('express').Router();
const TestCtrl = require('../controllers/test.ctrl');
const testCtrl = new TestCtrl();
const {logger} = require(`../logger`);

router.post('/create', async (req, res, next) => {
    try {
        await testCtrl.create(req.body);
        logger.info({ success: true, message: `kafka create message sent successfully.` })
        res.send({ success: true, message: `kafka create message sent successfully.` });
    } catch (err) {
        logger.error(err);
        res.send(err);
    }
})

router.post('/cancel', async (req, res, next) => {
    try {
        await testCtrl.cancel(req.body);
        logger.info({ success: true, message: `kafka create message sent successfully.` });
        res.send({ success: true, message: `kafka cancel message sent successfully.` });
    } catch (err) {
        logger.error(err);
        res.send(err);
    }
})

module.exports = router;