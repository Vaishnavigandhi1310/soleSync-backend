const mongoose = require('mongoose');

const StyleSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    img:{
        type:String
    }
},{
        timestamps:true
    })
    const styleModel = mongoose.model("styles",StyleSchema);
    module.exports = styleModel