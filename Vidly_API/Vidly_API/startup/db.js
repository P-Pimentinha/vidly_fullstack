const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');


    module.exports = async function() {
        //DataBase connection
        const db = config.get('db');
        await mongoose.connect(db)
        .then(() => winston.info(`Connected to ${db}.`));
        console.log('connected to mongo db..');
    }

    