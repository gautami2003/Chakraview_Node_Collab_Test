const multer = require('multer');

const { PUBLIC_DIR, ASSETS_DIR, IMAGES_DIR } = require('../constants/file-directories.constant');
const { FIELD_NAMES, FILE_MIMETYPES } = require('../constants/multer.constant');
const { IMAGE_JPEG, IMAGE_JPG, IMAGE_PNG } = FILE_MIMETYPES;

const getFileExtension = (file) => {
    const fileNameArr = file.originalname.split('.');
    return fileNameArr[fileNameArr.length - 1];
};

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${PUBLIC_DIR}/${ASSETS_DIR}/${IMAGES_DIR}`);
    },
    filename: (req, file, cb) => {
        const fileExt = getFileExtension(file);
        cb(null, `${file.fieldname}-${Date.now()}.${fileExt}`);
    },
});

const imageUploadMiddleware = multer({
    storage: imageStorage,
    fileFilter: (req, file, cb) => {
        const { mimetype } = file;
        if (mimetype === IMAGE_JPEG || mimetype === IMAGE_JPG || mimetype === IMAGE_PNG) {
            req.fileValidationError = false;
            return cb(null, true);
        }
        req.fileValidationError = true;
        return cb(null, false);
    },
}).single(FIELD_NAMES.IMAGE);

module.exports = {
    imageUploadMiddleware,
};