const express = require("express");
var path = require('path');

var exphbs = require("express-handlebars");
const multer = require('multer');
const app = express();

app.use(express.static('public/images'));
app.engine("handlebars",exphbs({defaultLayout: 'main'}));

const imageModel = require('./models/upload');



const imageData = imageModel.find({});
var Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/images");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: Storage,
}).single("image"); //Field name and max count
app.set("view engine","handlebars");

app.get("/",function(req,res){
  imageData.exec(function(err,data){
        if(err) throw err;

        console.log(data)

        res.render('home',{records:data})
    })
});

app.post("/",function(req,res){
  upload(req, res, function (err) {
   if (err) {
     console.log(err);
     return res.end("Something went wrong");
   } else {
     console.log(req.file.path);
    var filename = req.file.filename;

    var imageDetail = new imageModel({
      imagename: filename,
    });

    imageDetail.save(function(err,doc){
      if(err) throw err;

      imageData.exec(function(err,data) {
        if(err)  throw err;

         res.render('home',{records:data,success:true});

       })
           });
         }
       });
});




app.listen(5000,function(r){
  console.log("Server succesfully Started")
});
