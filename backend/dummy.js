const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');

require("dotenv").config();
const User = require('./model/User');
const Downloads = require('./model/Downloaded')
// require('./controllers/UserControllers')
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'))
const PORT = process.env.PORT;

app.use((req,res,next)=>{
  res.header('Access-Control-Allow-Origin','*');
  next();
})


//setting up multer library
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/Images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })

  const upload = multer({ storage: storage })

  // endpoint for uploading an image
  app.post('/upload',upload.single('file'), async (req,res)=>{
    console.log(req.file);
    try{
        const image = new User({
            // name: 'yash',
            image: req.file.filename,
            path: req.file.path,
        })
        await image.save();
        // console.log(image);

        res.status(201).send('image Uploaded')
    }catch(e){
        res.status(500).send('internal server error')
    }
  })

  // endpoint for getting all the image
  app.get('/getImages',async (req, res)=>{
  try{
    const images = await User.find();
    res.status(200).json(images);
  }catch(e){
    res.status(500).send('unable to get images')
  }

  })
  
  // endpoint for downloading an image
app.get('/download/:filename', async (req, res) => {
  const filename = req.params.filename;
  console.log(filename);
 try { 
   const imageUrl = `http://localhost:8001/Images/${filename}`;
   const varfilename = Math.floor(Math.random()*10000)

   const response = await axios.get(imageUrl, { responseType: 'stream' }); 
   // const savePath = path.join(__dirname, 'Output', 'image.jpg'); 
   const savePath = path.join(__dirname, 'Output', `${varfilename}.jpg`); 

   const writer = fs.createWriteStream(savePath); 
   response.data.pipe(writer); 
   writer.on('finish', () => { res.status(200).send('Image downloaded and saved successfully.'); 
 }); 
   writer.on('error', (err) => { 
     console.error('Error saving image:', err); res.status(500).json({ error: 'Internal Server Error' });
    }); 
 }catch (error) { 
   console.error('Error downloading image:', error); res.status(500).json({ error: 'Internal Server Error' }); }
 });

app.post('/save', async(req,res)=>{
  const Dfile =  req.body.imageName;
  const url = req.body.url
  
  try{
    const download = new Downloads({
        // name: 'yash',
        imageName: Dfile,
        url: url,
    })
    await download.save();

    res.status(201).send('image downloaded and saved')
}catch(e){
    res.status(500).send('internal server error')
}
})

app.get('/getDownloadedImages',async(req,res)=>{

  try{
    const images = await Downloads.find();
    res.status(200).json(images);

  }catch(err){
    res.status(500).send('unable to get images')
  }
})

app.listen(PORT,()=>{
    console.log("server is running on port", PORT)
})

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is Connected"))
  .catch((err) => console.log(err));




  ////////////////////////////////////////////////////////////////////////////////////////////
  //User file name dummy mongoose model

//   const mongoose =require('mongoose');

// const User = new mongoose.Schema({
//     name:String,
//     image: String,
//     path: String,
// });

// module.exports = mongoose.model('users', User);

