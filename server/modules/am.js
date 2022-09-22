const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const amSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:3,
        maxlength:30
    },
    emails:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
        min:10
    },
    address:{
        type:String,
        required:true,
        minLength:7
    },
    type:{
        type:String,
        required:true,
        minLength:3,
        maxlength:30
    },
    quantity:{
        type:Number,
        required:true,
        min:1,
        max:25
    },
    prescription:{
        type:String,
        required:true
    }
});

const amdata = new mongoose.model('am',amSchema);


module.exports = amdata;