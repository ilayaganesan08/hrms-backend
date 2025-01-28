require('dotenv').config();

module.exports = {
    mongodburl: process.env.DB_URL,
    hostname: process.env.HOSTNAME,
    port: process.env.PORT,
    live: false
}