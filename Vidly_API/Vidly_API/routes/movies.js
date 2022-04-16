const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const { Movie, validate } = require('../models/movies')
const mongoose = require('mongoose');
const {Genre} = require('../models/genres');

// get the list of all movies
router.get('/', async (req, res) => {
    const movies = await Movie.find();
    res.send(movies);
  });

   // creates a new movie
router.post('/', auth, async (req, res) => {

    // Validation of the data in (req.body) using the imported function validate
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    // Validation of the genre through ID using findById (mongoose model)
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');
    
    const movie = new Movie({ 
      title: req.body.title, //string
      genre: { // genreID
        _id: genre._id, //data obtained from the genreSchema
        name: genre.name //data obtained from the genreSchema
      },
      numberInStock: req.body.numberInStock, // number
      dailyRentalRate: req.body.dailyRentalRate ////number
    });
    await movie.save();
    
    res.send(movie);
  });

  router.put('/:id', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');
  
    const movie = await Movie.findByIdAndUpdate(req.params.id,
      { 
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
      }, { new: true });
  
    if (!movie) return res.status(404).send('The movie with the given ID was not found.');
    
    res.send(movie);
  });

  router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
  
    if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  
    res.send(movie);
  });

  router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
  
    if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  
    res.send(movie);
  });

 
module.exports = router;