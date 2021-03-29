const express = require('express');
const fs = require('fs');
const path = require('path')
const formidable = require('formidable');
   
const app = express();
   
app.post('/api/upload', (request, response, next) => {
    var formOptions = {
      multiples: true,
      uploadDir: __dirname,
      maxFileSize:1 * 1024 * 1024
    }
    const form = new formidable.IncomingForm();
  form.on('fileBegin', (filename, file) => {
  console.log(filename)
});
    form.parse(request, function(err, fields, files){
  
        var oldPath = files.profilePic.path;
        var newPath = path.join(__dirname, 'uploads')+ '/'+files.profilePic.name
        var rawData = fs.readFileSync(oldPath)
      
        fs.writeFile(newPath, rawData, function(err){
            if(err) console.log(err)
            return response.send("Successfully uploaded")
        })
  })
  
});