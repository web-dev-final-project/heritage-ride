const express = require('express');
const router = express.Router();
const blogData = require('../data/blog'); // Import the blog logic from the data folder

// Route to get all blog posts and render the view
router.get('/', (req, res) => {
    try {
        const blogs = blogData.getAllBlogs();
        res.render('blogPosts', { blogs });
    } catch (error) {
        res.status(500).render('error', { error: 'Failed to retrieve blog posts' });
    }
});

// Route to get a specific blog post by ID and render the view
router.get('/:id', (req, res) => {
    try {
        const blog = blogData.getBlogById(parseInt(req.params.id));
        if (!blog) {
            res.status(404).render('error', { error: 'Blog post not found' });
        } else {
            res.render('singleBlog', { blog });
        }
    } catch (error) {
        res.status(500).render('error', { error: 'Failed to retrieve the blog post' });
    }
});

// Route to render the form for creating a new blog post
router.get('/new', (req, res) => {
    res.render('createBlog', { userId: req.userId });
});

// Route to render the form for editing a blog post
router.get('/:id/edit', (req, res) => {
    try {
        const blog = blogData.getBlogById(parseInt(req.params.id));
        if (!blog) {
            res.status(404).render('error', { error: 'Blog post not found' });
        } else {
            res.render('editBlog', { blog, userId: req.userId });
        }
    } catch (error) {
        res.status(500).render('error', { error: 'Failed to retrieve the blog post' });
    }
});

// Route to handle creating a new blog post
router.post('/', (req, res) => {
    const { userId, title, content } = req.body;
    try {
        const newBlog = blogData.createBlog(userId, title, content);
        res.redirect(`/blogs/${newBlog.id}`);
    } catch (error) {
        res.status(400).render('error', { error: error.message });
    }
});

// Route to handle updating a blog post by ID
router.put('/:id', (req, res) => {
    const { userId, content } = req.body;
    try {
        const updatedBlog = blogData.updateBlog(userId, parseInt(req.params.id), content);
        res.redirect(`/blogs/${updatedBlog.id}`);
    } catch (error) {
        res.status(400).render('error', { error: error.message });
    }
});

// Route to handle deleting a blog post by ID
router.delete('/:id', (req, res) => {
    const { userId } = req.body;
    try {
        blogData.deleteBlog(userId, parseInt(req.params.id));
        res.redirect('/blogs');
    } catch (error) {
        res.status(400).render('error', { error: error.message });
    }
});

module.exports = router;

