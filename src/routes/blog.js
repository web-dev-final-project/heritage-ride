const express = require('express');
const router = express.Router();
const blogData = require('../data/blog'); // Import the blog logic from the data folder

// Route to get all blog posts
router.get('/', (req, res) => {
    try {
        const blogs = blogData.getAllBlogs();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve blog posts' });
    }
});

// Route to get a specific blog post by ID
router.get('/:id', (req, res) => {
    try {
        const blog = blogData.getBlogById(parseInt(req.params.id));
        if (!blog) {
            res.status(404).json({ error: 'Blog post not found' });
        } else {
            res.json(blog);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve the blog post' });
    }
});

// Route to create a new blog post (only customers can post)
router.post('/', (req, res) => {
    const { userId, title, content } = req.body;
    try {
        const newBlog = blogData.createBlog(userId, title, content);
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to update a blog post by ID (only the author can update their post)
router.put('/:id', (req, res) => {
    const { userId, content } = req.body;
    try {
        const updatedBlog = blogData.updateBlog(userId, parseInt(req.params.id), content);
        res.json(updatedBlog);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to delete a blog post by ID (only the author can delete their post)
router.delete('/:id', (req, res) => {
    const { userId } = req.body;
    try {
        const deletedBlog = blogData.deleteBlog(userId, parseInt(req.params.id));
        res.json(deletedBlog);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
