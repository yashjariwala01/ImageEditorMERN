const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  verifyUsernameAndEmailExists,
} = require("./utils/verifyUsernameAndEmailExists");

require("dotenv").config();
const {isAuth} = require('./middleware/Authentication')
const Image = require('./model/Images');
const Downloads = require('./model/Downloaded')
const User = require('./model/UserProfile')
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'))
const PORT = process.env.PORT || 8001;

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
      // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })

  const upload = multer({ storage: storage })

  // endpoint for uploading an image
  app.post('/upload',upload.single('file'), async (req,res)=>{
    console.log(req.file);
    try{
        const image = new Image({
            Image: req.file.filename,
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
  app.get('/getImages', async (req, res)=>{
  try{
    const images = await Image.find();
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
  console.log('hello world')
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

/////////////////////////////////////////////////////////////////////////////////////////////////


app.post('/register',async(req,res)=>{
  const isValid = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().min(3).max(30).alphanum().required(),
    password: Joi.string().min(8).max(16).required(),
    email: Joi.string().email().required(),
  }).validate(req.body);

  
  if (isValid.error) {
    return res.status(400).send({
      status: 400,
      message: "Invalid Input",
      data: isValid.error,
    });
  }

  
  const usernameEmailVerify = await verifyUsernameAndEmailExists(
    req.body.email,
    req.body.username
  );

  if (usernameEmailVerify === "E") {
    res.status(400).send({
      status: 400,
      message: "Email already exists!",
    });
    return;
  } else if (usernameEmailVerify === "U") {
    res.status(400).send({
      status: 400,
      message: "Username already exists!",
    });
    return;
  } else if (usernameEmailVerify === "Err") {
    res.status(400).send({
      status: 400,
      message: "DB Error: Couldn't register user!",
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_SALT))

  
  const userObject = new User({
    name: req.body.name,
    username : req.body.username,
    email : req.body.email,
    password: hashedPassword
})


    try{
        userObject.save();
        res.status(201).send({
            status:201,
            message: 'user created successfully!'
        })
    }catch(err){
        res.status(400).send({
            status: 400,
            message:'DB error, user creation failed',
            data: err,
        })
    }
})

app.post('/login', async (req,res)=>{
  const { loginId, password } = req.body;
  console.log(loginId, password);
  let userData;

  const isValid = Joi.object({
    loginId: Joi.string().email().required(),// Joi.string().email()
  }).validate(loginId);
    
  console.log(isValid)

  try {
    // Checking if the loginId is sent as Email or username based on that db call is made
    if (isValid.error) {
      userData = await User.findOne({ username: loginId });
    } else {
      userData = await User.findOne({ email: loginId });
    }

    // If user is not found we send an error
    if (!userData) {
      return res.status(400).send({
        status: 400,
        message: "No user found! Please register or check your credentials",
      });
    }

     // Password is matched with the encrypted db password
     const isPasswordMatched = await bcrypt.compare(password, userData.password);

    //  if (isPasswordMatched) {
    //    return res.status(200).send({
    //      status: 200,
    //      message: "Successfully logged in!",
    //    //  data: req.session.user,
    //    });
    //  } 
     if(!isPasswordMatched){
       return res.status(400).send({
         status: 400,
         message: "Incorrect Password!",
       });
     }

     const payload = {
      username: userData.username,
      name: userData.name,
      email: userData.email,
      userId: userData._id,
    };

    const token = await jwt.sign(payload, process.env.JWT_SECRET);

    res.status(200).send({
      status: 200,
      message: "Logged in successfully",
      data: {
        token,
      },
    });
    } catch (err) {
      res.status(400).send({
        status: 400,
        message: "DB Error: Login failed",
        data: err,
      });
    }
})









