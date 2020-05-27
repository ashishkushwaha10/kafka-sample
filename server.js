require('dotenv').config();

const express = require('express');
const app = express();
const {json, urlencoded} = require('body-parser');
const routes = require('./routes');
const {loggerInit, logger} = require('./logger');

app.use(json());
app.use(urlencoded({extended: true}));

app.use('*', (req, res, next) => {
    logger.info(req);
    next();
})

loggerInit();

app.use("/", routes);

process.on('uncaughtException', (err) => {
    logger.error(err);
    console.trace(err);
});

process.on('unhandledRejection', (err) => {
    logger.error(err);
    console.trace(`errrr: ${err}`);
});

app.listen(process.env.PORT, () => {
    console.log(`app listening at port ${process.env.PORT}.`)
});