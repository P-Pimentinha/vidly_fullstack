const winston = require('winston');
/* require('winston-mongodb'); */
require('express-async-errors');

module.exports = function(){
    //Process for Uncaught Exceptions
/* process.on('uncaughtException', (ex) => {
    console.log("we got an uncaught exception");
    winston.error(ex.message, ex);
    process.exit(1);
}); */

winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtException.log', level: 'error' })
);

//Process for Uncaught rejections
process.on('unhandledRejection', (ex) => {
    console.log("we got an unhandled rejection");
    winston.error(ex.message, ex);
    process.exit(1);
});


//logs error messages on the console
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),   
    ],
  });

  /* winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly'})); */
}