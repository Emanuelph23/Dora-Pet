const multer = require('multer');
const path = require('path');

//Config path to save images
const imageStorage = multer.diskStorage({
    destination: function(req, file, cb) {

        let folder = ""

        if(req.baseUrl.includes('users')) {
            folder = 'users';
        } else if(req.baseUrl.includes('pets')) {
            folder = 'pets';
        }

        cb(null, `public/images/${folder}`);

    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + String(Math.floor(Math.random() * 1000)) + path.extname(file.originalname));
    }
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter: function(req, file, cb) {

        if(!file.originalname.match(/\.(jpg|png)$/)) {
            return cb(new Error('Por favor, envie uma imagem válida!'))
        }

        cb(undefined, true)
    }
})

module.exports = { imageUpload }