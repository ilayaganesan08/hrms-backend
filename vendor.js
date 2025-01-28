const express = require('express');
const Router = express.Router();
const DB = require('../../utilities/db');
const db = require('../../utilities/schemaconnection');

Router.post('/addvendor', verifyToken, async function (req, res) {
    try {
        const { country,city,address,phone,email,suppliername } = req.body;

        const results = await db.vendors.findOne({ email: email });
        if (results) {
            return res.status(409).json({ status: 0, message: 'Vendor already exists' });
        }

        const newvendor = { country,city,address,phone,email,suppliername  };
        DB.InsertDocument('vendors', newvendor, function (err, result) {
            if (err) {
                return res.status(400).json({ status: 0, message: 'Server error occurred', error: err.message });
            } else {
                return res.status(200).json({ status: 1, message: 'Vendor added successfully', data: result });
            }
        });
    } catch (error) {
        return res.status(500).json({ status: 0, message: 'Internal server error', error: error.message });
    }
});

Router.post('/listvendor', verifyToken, async function (req, res) {
    const { currentPage = 1, perPage = undefined, filter } = req.body;
    try {
        const skip = (currentPage - 1) * perPage;
        const limit = perPage ? parseInt(perPage) : 0;

        let filterConditions = {};
        filterConditions['isdeleted'] = { $ne: true };

        if (filter && filter['question']) {
            filterConditions['question'] = { $regex: new RegExp(filter['question'].filter, 'i') };
        }
        if (filter && filter['answer']) {
            filterConditions['answer'] = { $regex: new RegExp(filter['answer'].filter, 'i') };
        }


        const query = db.vendors.find(filterConditions).sort({ createdAt: -1 });
        const [result, total] = await Promise.all([
            query.skip(skip).limit(limit),
            db.vendors.countDocuments(filterConditions)
        ]);

        let tempRes = []
        if (result && result.length > 0) {
            result.map((item) => {
                let obj = {}
                obj['_id'] = item._id || null;
                obj['suppliername'] = item.suppliername || null;
                obj['email'] = item.email || null;
                obj['phone'] = item.answphoneer || null;
                obj['city'] = item.city || null;
                obj['address'] = item.address || null;
                obj['country'] = item.country || null;
                obj['isactive'] = item.isactive || false;
                tempRes.push(obj)
            })
        }
        return res.status(200).json({ status: 1, message: 'Vendor list retrieved successfully', data: tempRes, total: total });

    } catch (error) {
        return res.status(500).json({ status: 0, message: 'Internal server error', error: error.message });
    }
});

Router.get('/viewvendor/:id', verifyToken, async function (req, res) {
    try {
        const { id } = req.params;

        DB.GetOneDocument('vendors', { _id: id }, {}, {}, function (err, result) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ status: 0, message: 'Internal server error', error: err.message });
            }

            let obj = {
                _id: result._id || null,
                suppliername: result.suppliername || null,
                email: result.email || null,
                phone: result.phone || null,
                city: result.city || null,
                address: result.address || null,
                country: result.country || null,
                isactive: result.isactive || false
            };

            return res.status(200).json({ status: 1, message: 'Vendor retrieved successfully', data: obj });
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ status: 0, message: 'Internal server error', error: error.message });
    }
});
Router.post('/updatevendor/:id', verifyToken, async function (req, res) {
    try {
        const { id } = req.params;
        const { country,city,address,phone,email,suppliername } = req.body;

        const results = await db.vendors.findOne({ email: email, _id: { $ne: id } });
        if (results) {
            return res.status(409).json({ status: 0, message: 'Vendor already exists' });
        }

        const updatedVendor = { country,city,address,phone,email,suppliername  };
        DB.FindUpdateDocument('vendors', { _id: id }, updatedVendor, {}, function (err, result) {
            if (err) {
                return res.status(400).json({ status: 0, message: 'Server error occurred', error: err.message });
            } else {
                return res.status(200).json({ status: 1, message: 'Vendors updated successfully', data: result });
            }
        });
    } catch (error) {
        return res.status(500).json({ status: 0, message: 'Internal server error', error: error.message });
    }
});

module.exports = Router;
