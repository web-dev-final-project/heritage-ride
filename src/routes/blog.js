const express = require('express');
const router = express.Router();
const Blog = require('../data/blogs');

// Get all blog posts
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find({});
        res.render('blogPosts', { blogs });
    } catch (error) {
        res.status(500).render('error', { error: 'Failed to load blogs' });
    }
});

// Get form to create a new blog post
router.get('/new', (req, res) => {
    res.render('createBlog', { userId: req.session.userId });
});

// Get a single blog post by ID
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) throw new Error('Blog not found');
        res.render('singleBlog', { blog });
    } catch (error) {
        res.status(404).render('error', { error: error.message });
    }
});

// Create a new blog post
router.post('/', async (req, res) => {
    try {
        const { title, content, author, authorRole } = req.body;
        const newBlog = new Blog({ title, content, author, authorRole });
        await newBlog.save();
        res.redirect('/blogs');
    } catch (error) {
        res.status(400).render('error', { error: error.message });
    }
});

// Get form to edit a blog post by ID
router.get('/:id/edit', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) throw new Error('Blog not found');
        res.render('editBlog', { blog });
    } catch (error) {
        res.status(404).render('error', { error: error.message });
    }
});

// Update a blog post by ID
router.put('/:id', async (req, res) => {
    try {
        const { content } = req.body;
        const blog = await Blog.findByIdAndUpdate(req.params.id, { content }, { new: true });
        if (!blog) throw new Error('Blog not found');
        res.redirect(`/blogs/${blog._id}`);
    } catch (error) {
        res.status(400).render('error', { error: error.message });
    }
});

// Delete a blog post by ID
router.delete('/:id', async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.redirect('/blogs');
    } catch (error) {
        res.status(500).render('error', { error: 'Failed to delete blog' });
    }
});

module.exports = router;


