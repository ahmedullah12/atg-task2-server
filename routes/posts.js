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

router.delete('/posts/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const existingPost = await Post.findById(postId);
        if (!existingPost) {
            return res.status(404).json({ status: false, message: 'Post not found' });
        }

        await Post.findByIdAndDelete(postId);
        res.json({ status: true, message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
});

router.get('/my-posts', async (req, res) => {
    try {
        const userEmail = req.query.email;
        if (!userEmail) {
            return res.status(400).json({ status: false, message: 'User email is required' });
        }

        const query = { userEmail };
        const myPosts = await Post.find(query).sort({ _id: -1 });

        res.json({ status: true, myPosts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
});

router.put('/posts/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const { newDesc } = req.body;

        const existingPost = await Post.findById(postId);
        if (!existingPost) {
            return res.status(404).json({ status: false, message: 'Post not found' });
        }

        existingPost.desc = newDesc;
        const updatedPost = await existingPost.save();

        res.json({ status: true, message: 'Post has been updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
});

router.post('/posts/comments/:postId', async (req, res) => {
    try {
      const postId = req.params.postId;
      const { userId, userEmail, userName, comment } = req.body;

      const existingPost = await Post.findById(postId);
      if (!existingPost) {
        return res.status(404).json({ status: false, message: 'Post not found' });
      }

      existingPost.comments.push({ userId, userEmail, userName, comment });
      const updatedPost = await existingPost.save();
  
      res.json({ status: true, message: 'Comment added successfully', updatedPost });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: 'Internal server error' });
    }
});

router.post('/posts/likes/:postId', async (req, res) => {
    try {
      const postId = req.params.postId;
      const { userId } = req.body;
  
      const existingPost = await Post.findById(postId);
      if (!existingPost) {
        return res.status(404).json({ status: false, message: 'Post not found' });
      }

      const hasLiked = existingPost.likes.some((like) => like.userId === userId);
      if (hasLiked) {
        existingPost.likes = existingPost.likes.filter((like) => like.userId !== userId);
      } 
      else {
        existingPost.likes.push({ userId });
      }
  
      const updatedPost = await existingPost.save();
  
      res.json({ status: true, message: 'Like updated successfully', updatedPost });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: 'Internal server error' });
    }
  });

export {router as PostRouter}

