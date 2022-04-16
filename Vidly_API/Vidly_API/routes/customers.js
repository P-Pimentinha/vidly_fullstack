const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const { Customer, validate } = require('../models/customer')
const mongoose = require('mongoose');

const _ = require('lodash');


// get the list of all customers 
router.get('/', async (req, res) => {
    const customers = await Customer.find();
    res.send(customers);
  });

  // creates a new customer
  router.post('/', async (req, res) => {

    // Validation of the data in (req.body) using the imported function validate 
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    

    const customer = new Customer(_.pick(req.body, ['name', 'isGold', 'phone']));
    
    await customer.save();
    
    res.send(customer);
  });

  router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const customer = await Customer.findByIdAndUpdate(req.params.id, { 
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone }, {
      new: true
    });
  
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
    
    res.send(customer);
  });

  router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
  
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
    res.send(customer);
  });

  router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
  
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
    res.send(customer);
  }); 

 /*  router.get('/:name', async (req, res) => {
    const customer = await Customer.find({name: req.params.name});
  
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
    res.send(customer);
  }); */
 

 
  module.exports = router;