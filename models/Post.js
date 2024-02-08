import express from 'express';
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    desc: {type: String, required: true},
    img: {type: String, required: false, default: ""},
    userEmail: {type: String, required: true},
    userId: {type: String, required: true},
    userName: {type: String, required: true}
});

const PostModel = mongoose.model("posts", PostSchema);

export {PostModel as Post};