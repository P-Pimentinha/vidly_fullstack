const auth = require('../middleware/auth');
const {Rental, validate} = require('../models/rental'); 
const {Movie} = require('../models/movies'); 
const {Customer} = require('../models/customer'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Fawn = require('fawn');

Fawn.init(mongoose);

// get the list of all rentals 
router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

// creates a new rental
router.post('/', auth, async (req, res) => {

  // Validation of the data in (req.body) using the imported function validate
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  // Validation of the customer through ID using findById (mongoose model)
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  // Validation of the movie through ID using findById (mongoose model)
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  // Validation of product in stock
  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  let rental = new Rental({ 
    customer: { //Customer ID
      _id: customer._id,
      name: customer.name, 
      phone: customer.phone
    },
    movie: { // movie ID
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  
try{ //two Phase Commit using Fawn // fawn interacts directly with the collection in mongo db (casesensitive)
  new Fawn.Task()
    .save('rental', rental)
    .update('movies', {_id: movie._id}, {
      $inc: { numberInStock: -1}
    })
    .run();
  
  res.send(rental);
} catch(ex){
  res.status(500).send('Something Failed.')
}

  
});

// gets a single object based on the ID
router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

module.exports = router; 