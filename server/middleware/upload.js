const { upload } = require('../config/cloudinary');

// Single image upload middleware
const uploadSingle = upload.single('image');

// Multiple images upload
const uploadMultiple = upload.array('images', 5);

module.exports = { uploadSingle, uploadMultiple };
