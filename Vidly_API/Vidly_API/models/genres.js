const Joi = require('joi');
const mongoose = require('mongoose');

//Schema used to create the genre object 
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

const Genre = mongoose.model('Genre', genreSchema);


// Validation of the data sent by the client using joi
function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  };

  return Joi.validate(genre, schema);
}

exports.genreSchema = genreSchema;
exports.Genre = Genre; 
exports.validate = validateGenre;