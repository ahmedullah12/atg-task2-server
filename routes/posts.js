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

export {router as PostRouter}

