const express = require('express');
const app = express();
const bodyParser = require('body-parser');//postman 
const cors = require('cors');// cors origin problem
const mongoose = require('mongoose'); // mongodb orm
const path = require('path');
require('dotenv').config();

const { port, hostname, mongodburl } = require('./config/db'); // destructing

global.helperFunction = require('./utilities/helperfunctions.js');
global.verifyToken = require('./utilities/verifyToken.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(mongodburl, {}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

app.use(cors());

require('./routes')(app);

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`); // template literals
});
