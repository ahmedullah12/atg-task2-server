import express from 'express';
import mongoose from 'mongoose';


const commentSchema = new mongoose.Schema({
    userId: {type: String,required: true,},
    userEmail: {type: String,required: true,},
    userName: {type: String,required: true,},
    comment: {type: String,required: true,},
  });

const PostSchema = new mongoose.Schema({
    desc: {type: String, required: true},
    img: {type: String, required: false, default: ""},
    userEmail: {type: String, required: true},
    userId: {type: String, required: true},
    userName: {type: String, required: true},
    comments:{type: [commentSchema], default: []},
});

const PostModel = mongoose.model("posts", PostSchema);

export {PostModel as Post};