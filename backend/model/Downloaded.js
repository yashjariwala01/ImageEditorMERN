const mongoose =require('mongoose');

const Downloaded = new mongoose.Schema({

imageName: {
    type:String,
    require:true,    
    },

url: {
    type: String,
    requrie:true,
    }
    
});

module.exports = mongoose.model('download', Downloaded);