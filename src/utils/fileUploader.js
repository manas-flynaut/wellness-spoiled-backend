const fs = require("fs");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { retrieveFileExt } = require("../utils/retrieveFileExt");
const { normalize } = require('path')

function fileUploader(destinationPath) {
  fs.mkdirSync(destinationPath, { recursive: true });
  // console.log("destinationPathdestinationPath",normalize(destinationPath))
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, normalize(destinationPath));
    },
    filename: function (req, file, cb) {
      cb(null, `${uuidv4()}.${retrieveFileExt(file)}`);
    },
  });
  const uploader = multer({ storage: storage });

  return uploader;
}

module.exports = { fileUploader };