const express = require('express');
const Router = express.Router();
const mongoose = require('mongoose')
const DB = require('../../utilities/db');
const db = require('../../utilities/schemaconnection');
const { countriesname, countriescode } = require('../../models/countries');
const Countries = require('../../models/countries');

Router.post('/addcountries', async function (req, res) {
    try{
        const {countriesname, countriescode} = req.body;
        console.log('Request Body:', req.body);
        if (!countriesname || !countriescode) {
            return res.status(400).json({ status: 0, message: 'Both countriesname and countriescode are required.' });
        }
        const results = await db.countries.findOne({countriesname: countriesname});
        if(results){
            return res.status(400).json({status: 0, message: 'Couintry already exists'});
        }
        const newcountries = { countriesname, countriescode};
        DB.InsertDocument('countries', newcountries, function(err, result){
            if (err) {
                return res.status(400).json({ status: 0, message: 'Server error occurred', error: err.message });
            } else {
                return res.status(200).json({ status: 1, message: 'Country added successfully', data: result });
            }
        })
    }
    catch (error) {
        return res.status(500).json({status:0, message: 'Internal server error', error: error.message});
    }
})

Router.get('/listcountries', async function (req, res) {
  DB.GetDocument('countries', {}, {}, {}, function (err, result) {
          if (err) {
              return res.status(500).json({ status: 0, message: 'Internal server error', error: err.message });
          } else {
              return res.status(200).json({ status: 1, message: 'countries list retrieved successfully', data: result });
          }
      })
    
})

Router.get('/viewcountries/:id', async function (req, res) {
    try{
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: 0, message: 'Invalid ID format' });
        }

        DB.GetOneDocument('countries', {_id: id}, {}, {}, function (err, result){
            if(err){
                console.error('Database error:', err);

                return res.status(500).json({ status: 0, message: 'Internal server error', error: err.message});
            }

            let obj = {
                _id: result._id || null,
                countriesname: result.countriesname || null,
                countriescode: result.countriescode || null,
                status: result.status || false,

            };
            return res.status(200).json({ status: 1, message:'Countries retrieved successfully', data: obj});
        });
    }catch(error){
        console.error('Server error:', error);

        return res.status(500).json({status:0, message: 'Internal server error', error: error.message});
    }
})


module.exports = Router;
