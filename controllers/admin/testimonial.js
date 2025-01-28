const express = require('express');
const Router = express.Router();
const DB = require('../../utilities/db');
const db = require('../../utilities/schemaconnection');
const upload = require('../../utilities/fileupload');

Router.post('/addtestimonial', upload.single('profile'), async function (req, res) {
    try {
        const { author, answer, role, content } = req.body;
        const results = await db.testimonials.findOne({ author: author });
        if (results) {
            return res.status(409).json({ status: 0, message: 'Testimonial already exists' });
        }
        const newDate = {
            author, answer, role, content
        };

        if (req.file) {
            newDate['profile'] = req.file.path;
        }
        DB.InsertDocument('testimonials', newDate, function (err, result) {
            if (err) {
                return res.status(400).json({ status: 0, message: 'Server error occurred', error: err.message });
            } else {
                return res.status(200).json({ status: 1, message: 'Testimonial added successfully', data: result });
            }
        });
    } catch (error) {
        return res.status(500).json({ status: 0, message: 'Internal server error', error: error.message });
    }
});

Router.get('/listtestimonial', async function (req, res) {
    DB.GetDocument('testimonials', {}, {}, {}, function (err, result) {
        if (err) {
            return res.status(500).json({ status: 0, message: 'Internal server error', error: err.message });
        } else {
            return res.status(200).json({ status: 1, message: 'Faq list retrieved successfully', data: result });
        }
    })
});

Router.get('/viewtestimonial/:id', async function (req, res) {
    try {
        const { id } = req.params;

        DB.GetOneDocument('testimonials', { _id: id }, {}, {}, function (err, result) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ status: 0, message: 'Internal server error', error: err.message });
            }
            let obj = {
                _id: result._id || null,
                author: result.author || null,
                content: result.content || null,
                role: result.role || null,
                profile: result.profile || null,
                isactive: result.isactive || false
            };

            return res.status(200).json({ status: 1, message: 'Faq retrieved successfully', data: obj });
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ status: 0, message: 'Internal server error', error: error.message });
    }
});


Router.post('/updatetestimonial/:id', upload.single('profile'), async function (req, res) {
    try {
        const { id } = req.params;
        const { author, answer, role, content } = req.body;

        const results = await db.faqs.findOne({ author: author, _id: { $ne: id } });
        if (results) {
            return res.status(409).json({ status: 0, message: 'Testimonial already exists' });
        }

        const newDate = {
            author, answer, role, content
        };
        if (req.file) {
            newDate['profile'] = req.file.path;
        }
        DB.FindUpdateDocument('testimonials', { _id: id }, newDate, {}, function (err, result) {
            if (err) {
                return res.status(400).json({ status: 0, message: 'Server error occurred', error: err.message });
            } else {
                return res.status(200).json({ status: 1, message: 'Testimonial updated successfully', data: result });
            }
        });
    } catch (error) {
        return res.status(500).json({ status: 0, message: 'Internal server error', error: error.message });
    }
});




module.exports = Router;
