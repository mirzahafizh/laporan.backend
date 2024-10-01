const multer = require('multer');

// Configure Multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage
 }).array('files'); // Use 'files' to match your form input

module.exports = upload;
