// Express Framework 
const express = require('express');
const app = express();
const winston = require('winston')

/* const { Err } = require('joi/lib/errors'); */
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

//Server connection
const port = process.env.PORT || 4000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;