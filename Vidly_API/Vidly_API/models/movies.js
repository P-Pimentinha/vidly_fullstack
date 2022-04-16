const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('./genres');

//Schema used to create the movie object 
const Movie = mongoose.model('Movies', new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true, 
      minlength: 5,
      maxlength: 255
    },
    genre: { 
      type: genreSchema, // relation with genreSchema
      required: true
    },
    numberInStock: { 
      type: Number, 
      required: true,
      min: 0,
      max: 255
    },
    dailyRentalRate: { 
      type: Number, 
      required: true,
      min: 0,
      max: 255
    }
  }));

  // Validation of the data sent by the client using the 2 npm : joi and joi-objectid(npm loaded on index.js)
  function validateMovie(movie) {
    const schema = {
      title: Joi.string().min(5).max(50).required(),
      genreId: Joi.objectId().required(),
      numberInStock: Joi.number().min(0).required(),
      dailyRentalRate: Joi.number().min(0).required()
    };
  
    return Joi.validate(movie, schema);
  }
  
  exports.Movie = Movie;
  exports.validate = validateMovie;