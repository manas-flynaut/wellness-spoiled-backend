const path = require('path');
const s3  = require("./s3");
const fs = require('fs');

async function uploadFile(chatfile,location) {
    let fileName = path.parse(chatfile).base; 
    const fileContent = fs.readFileSync(chatfile);

    const params = {
        Bucket: "wellnessspoiled",
        Key: location+ '/' + fileName, // File name you want to save as in S3
        Body: fileContent,
        // ACL: 'public-read'
    };

    const uploadedFile = await s3.upload(params).promise();
    // fs.unlink(chatfile, function (err) {
    // if (err) return console.log(err);
    // });
    console.log(location+ '/' + fileName);
    return location+ '/' + fileName;
  }
  
  module.exports = { uploadFile };