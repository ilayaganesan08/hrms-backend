const express = require('express');
const Router = express.Router();
const mongoose = require('mongoose')
const DB = require('../../utilities/db');
const db = require('../../utilities/schemaconnection');
const { status } = require('../../models/countries');


Router.post('/addemployeesalary', async function (req, res) {
    console.log("res", res)
    try{

        const {employeeid,basicsalary,allowances,deductions,effectivedate} = req.body;

        if(!employeeid || !basicsalary || !allowances || !deductions || !effectivedate ){

            return res.status(400).json({
                status:0,
                message:'Missing required fields'
            })
        }

        const results = await db.employeesalary.findOne({employeeid})
        if(results){
            return res.status(409).json({
                status:0,
                message: 'Employee salary already exits'
            })
        }


        const netsalary = basicsalary + allowances.amount - deductions.amount;
        console.log('netsalary', netsalary)
        console.log('netsalary', basicsalary)
        console.log('netsalary', allowances)
        console.log('netsalary', deductions)

        const newEmployeesalary = {
            employeeid,basicsalary,allowances,deductions,netsalary,effectivedate
        }

        DB.InsertDocument('employeesalary', newEmployeesalary, function (err, result){
            if(err) {
                return res.status(400).json({
                    status:0,
                    message:'Server error occurred',
                    error:err.message
                })
            }else{
                return res.status(200).json({status:1, message: 'Employeesalary added successfully', data: result})
            }
        })
    }catch (error){
        return res.status(500).json({ status: 0, message: 'Internal server error', error: error.message });
    }
    
})

Router.get('/listemployeesalary', async function(req, res){
    DB.GetDocument('employeesalary', {},{},{}, function(err,result){

        if(err){
            return res.status(500).json({
                status:0,
                message:'Internal server error',
                error: err.message
            })
        }else{
            return res.status(200).json({
                status:0,
                message:'employeesalary list retrived successfully',
                data: result
    })
        }
    })
})

Router.get('/viewemployeesalary', async function (req, res) {
    try {
        
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ status: 0, message: 'Invalid ID format' });
        }

             DB.GetOneDocument('employeesalary', {_id: id}, {}, {}, function (err, result){
                        if(err){
                            console.error('Database error:', err);
            
                            return res.status(500).json({ status: 0, message: 'Internal server error', error: err.message});
                        }
            
                        let obj = {
                            _id: result._id || null,
                            employeesalaryid: result.employeesalaryid || null,
                            employeeid: result.employeeid || null,
                            basicsalary: result.basicsalary || null,
                            allowances: result.allowances || null,
                            deductions: result.deductions || null,
                            netsalary: result.netsalary || null,
                            effectivesalary: result.effectivesalary || null,
            
                        };
                        return res.status(200).json({ status: 1, message:'Taxes retrieved successfully', data: obj});
        })
}catch(error){
    console.error('Server error:', error);

    return res.status(500).json({status:0, message: 'Internal server error', error: error.message});
}
})

Router.post('/updateemployeesalary/:id', async function(req, res){
    try{

        const {id} = req.params;
        const {employeesalaryid,employeeid,basicsalary,allowances,deductions,netsalary,effectivesalary} = req.body;

        const updateemployeesalary = {employeesalaryid,employeeid,basicsalary,allowances,deductions,netsalary,effectivesalary};

          DB.FindUpdateDocument('employeesalary', {_id: id}, updateemployeesalary, {},  function (err, result){
                   if(err){
                       return res.status(400).json({
                           status:0,
                           message: 'Server error occurred',
                           error: err.message
                       })
                   }else{
                       return res.status(200).json({
                           status:1,
                           message: 'Employee Salary updated successfully',
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
