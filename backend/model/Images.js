const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  Image:{
    type:String,
    require: true,
  },
  path:{
    type:String,
    require: true,
  },
  creationDateTime: {
    type: Date,
    default: Date.now(),
    require: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    require: true,
  },
  

});

module.exports = mongoose.model("images", ImageSchema);