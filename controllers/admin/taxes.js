const express = require('express');
const Router = express.Router();
const mongoose = require('mongoose')
const DB = require('../../utilities/db');
const db = require('../../utilities/schemaconnection');


Router.post('/addtax', async function(req, res) {
    try{
        const {taxid, taxtype, taxableamount, taxrate, fillingdate, paymentstatus} = req.body;
        console.log(paymentstatus)

        if(!taxid || !taxtype || !taxableamount || !taxrate || !fillingdate || !paymentstatus){
            console.log(req.body);

            return res.status(400).json({
                status:0,
                message:'Missing requried fields'
            })
        }
        const results = await db.taxes.findOne({taxid});
        if(results){
            return res.status(409).json({
                status:0,
                message:'taxes already exists'
            })
        }
        const totaltax=taxableamount * (taxrate / 100);

        const newTaxes = {
            taxid, taxtype, taxableamount, taxrate, totaltax,fillingdate, paymentstatus
        };

        DB.InsertDocument('taxes', newTaxes, function (err, result){
            if(err) {
                return res.status(400).json({
                    status:0,
                    message:'Server error occurred',
                    error:err.message
                })
            }else{
                return res.status(200).json({status:1, message: 'Taxes added successfully', data: result})
            }
        }
)}catch (error){
        return res.status(500).json({ status: 0, message: 'Internal server error', error: error.message });
    }
    
})

Router.get('/listtax', async function(req, res) {
    DB.GetDocument('taxes', {}, {}, {}, function(err, result){
        if(err){
            console.error('Database error:', err);
            return res.status(500).json({
                status:0,
                message:'Internal server error',
                error: err.message
            })
        }else{
            return res.status(200).json({
                status:1,
                message:'Taxes list retrived successfully',
                data: result
            })
        }
    })
    
})

Router.get('/viewtax/:id', async function (req, res) {
    try{
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: 0, message: 'Invalid ID format' });
        }

        DB.GetOneDocument('taxes', {_id: id}, {}, {}, function (err, result){
            if(err){
                console.error('Database error:', err);

                return res.status(500).json({ status: 0, message: 'Internal server error', error: err.message});
            }

            let obj = {
                _id: result._id || null,
                taxid: result.taxid || null,
                taxtype: result.taxtype || null,
                taxableamount: result.taxableamount || null,
                taxrate: result.taxrate || null,
                totaltax: result.totaltax || null,
                fillingdate: result.fillingdate || null,
                paymentstatus: result.paymentstatus || false,

            };
            return res.status(200).json({ status: 1, message:'Taxes retrieved successfully', data: obj});
        });
    }catch(error){
        console.error('Server error:', error);

        return res.status(500).json({status:0, message: 'Internal server error', error: error.message});
    }
})

Router.post('/updatetax/:id', async function (req, res) {
    
    try{
        const {id} = req.params;
        const {taxtype, taxableamount, taxrate, totaltax, fillingdate, paymentstatus} = req.body;

        // const results = await db.taxes.findOne({_id: {$ne: id}});
        // if(results){
        //     return res.status(409).json({
        //         status:0,
        //         message:'Tax already exists'
        //     })
        // }

        const updateTax = {taxtype, taxableamount, taxrate, totaltax, fillingdate, paymentstatus};


        DB.FindUpdateDocument('taxes', {_id: id}, updateTax, {},  function (err, result){
            if(err){
                return res.status(400).json({
                    status:0,
                    message: 'Server error occurred',
                    error: err.message
                })
            }else{
                return res.status(200).json({
                    status:1,
                    message: 'Taxes updated successfully',
                    data: result
                })
            }
        })
    } catch(error){
        return res.status(500).json({
            status:0,
            message: 'Internal server error', 
            error: error.message
            
        })
    }

})

module.exports = Router;
