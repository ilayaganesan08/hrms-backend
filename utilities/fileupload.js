const multer = require('multer');

const AUD = './uploads/audios/';
const VID = './uploads/videos/';
const IMG = './uploads/images/';
const OTH = './uploads/others/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, IMG);
        } else if (file.mimetype == "audio/mpeg") {
            cb(null, AUD);
        } else if (file.mimetype == "video/mp4") {
            cb(null, VID);
        } else {
            cb(null, OTH);
        }
    },
    filename: (req, file, cb) => {
        var d = new Date();
        var randomName = d.getTime();

        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, randomName + fileName)
    }
});
var upload = multer({
    storage: storage,
});

module.exports = upload;
