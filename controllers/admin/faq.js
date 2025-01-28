const express = require('express');
const Router = express.Router();
const DB = require('../../utilities/db');
const db = require('../../utilities/schemaconnection');

// const FaqModel = re();

Router.post('/addfaq', async function (req, res) {
    try {
        const { question, answer } = req.body;
        const results = await db.faqs.findOne({ question: question });
        if (results) {
            return res.status(409).json({ status: 0, message: 'Faq already exists' });
        }
        const newfaq = { question, answer };
        DB.InsertDocument('faqs', newfaq, function (err, result) {
            if (err) {
                return res.status(400).json({ status: 0, message: 'Server error occurred', error: err.message });
            } else {
                return res.status(200).json({ status: 1, message: 'Faq added successfully', data: result });
            }
        });
    } catch (error) {
        return res.status(500).json({ status: 0, message: 'Internal server error', error: error.message });
    }
});

Router.post('/listfaq', verifyToken, async function (req, res) {
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


        const query = db.faqs.find(filterConditions).sort({ createdAt: -1 });
        const [result, total] = await Promise.all([
            query.skip(skip).limit(limit),
            db.faqs.countDocuments(filterConditions)
        ]);

        let tempRes = []
        if (result && result.length > 0) {
            result.map((item) => {
                let obj = {}
                obj['_id'] = item._id || null;
                obj['question'] = item.question || null;
                obj['answer'] = item.answer || null;
                obj['isactive'] = item.isactive || false;
                tempRes.push(obj)
            })
        }
        return res.status(200).json({ status: 1, message: 'Faq list retrieved successfully', data: tempRes, total: total });

    } catch (error) {
        return res.status(500).json({ status: 0, message: 'Internal server error', error: error.message });
    }
});

Router.get('/viewfaq/:id', verifyToken, async function (req, res) {
    try {
        const { id } = req.params;

        DB.GetOneDocument('faqs', { _id: id }, {}, {}, function (err, result) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ status: 0, message: 'Internal server error', error: err.message });
            }

            let obj = {
                _id: result._id || null,
                question: result.question || null,
                answer: result.answer || null,
                isactive: result.isactive || false
            };

            return res.status(200).json({ status: 1, message: 'Faq retrieved successfully', data: obj });
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ status: 0, message: 'Internal server error', error: error.message });
    }
});
Router.post('/updatefaq/:id', verifyToken, async function (req, res) {
    try {
        const { id } = req.params;
        const { question, answer } = req.body;

        const results = await db.faqs.findOne({ question: question, _id: { $ne: id } });
        if (results) {
            return res.status(409).json({ status: 0, message: 'Faq already exists' });
        }

        const updatedFaq = { question, answer };
        DB.FindUpdateDocument('faqs', { _id: id }, updatedFaq, {}, function (err, result) {
            if (err) {
                return res.status(400).json({ status: 0, message: 'Server error occurred', error: err.message });
            } else {
                return res.status(200).json({ status: 1, message: 'Faqs updated successfully', data: result });
            }
        });
    } catch (error) {
        return res.status(500).json({ status: 0, message: 'Internal server error', error: error.message });
    }
});

module.exports = Router;
