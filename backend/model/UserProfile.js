// const mongoose =require('mongoose');

// const User = new mongoose.Schema({
//     name:String,
//     image: String,
//     path: String,
// });

// module.exports = mongoose.model('users', User);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  username: {
    type: String,
    unique: true,
    require: true,
  },
  email: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("usersProfile", UserSchema);