import express from 'express';
import { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog } from '../data/blog.js';

const router = express.Router();

// Route to display all blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await getAllBlogs();
        res.render('blogs', { blogs });
    } catch (e) {
        res.status(500).send("Error fetching blogs");
    }
});

// Route to display a specific blog by ID
router.get('/:id', async (req, res) => {
    try {
        const blog = await getBlogById(req.params.id);
        if (!blog) {
            res.status(404).send("Blog not found");
        } else {
            res.render('blogDetail', { blog });
        }
    } catch (e) {
        res.status(500).send("Error fetching the blog");
    }
});

// Route to create a new blog
router.post('/', async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            res.status(400).send("Title and content are required");
            return;
        }
        const newBlogId = await createBlog(title, content);
        res.redirect(`/blogs/${newBlogId}`);
    } catch (e) {
        res.status(500).send("Error creating the blog");
    }
});

// Route to update an existing blog
router.put('/:id', async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            res.status(400).send("Title and content are required");
            return;
        }
        const updatedBlog = await updateBlog(req.params.id, title, content);
        res.redirect(`/blogs/${updatedBlog._id}`);
    } catch (e) {
        res.status(500).send("Error updating the blog");
    }
});

// Route to delete a blog
router.delete('/:id', async (req, res) => {
    try {
        await deleteBlog(req.params.id);
        res.redirect('/blogs');
    } catch (e) {
        res.status(500).send("Error deleting the blog");
    }
});

export default router;
