// middleware/uploadMemory.js
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }); // file will be in req.file.buffer
module.exports = upload;
