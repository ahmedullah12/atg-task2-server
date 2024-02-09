import express from 'express';
const router = express.Router();
import { Post } from '../models/Post.js';


router.get('/posts', async(req, res) => {
    try {
        const query = {};
        const posts = await Post.find(query).sort({ _id: -1 });
        res.json({ status: true, posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
});

router.post('/posts', async (req, res) => {
    try {
        const postData = req.body;
        if (!postData.desc || !postData.userEmail || !postData.userId || !postData.userName) {
            return res.status(400).json({ status: false, message: 'Incomplete post data' });
        }


        const newPost = new Post(postData);
        const savedPost = await newPost.save();

        res.json({ status: true, message: "Post has been added." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
});

export {router as PostRouter}

