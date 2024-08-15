// blog.js

// Array to store blog posts
const blogs = [];

// Array to store users (customers, sellers, experts)
const users = [
    { id: 1, name: 'John Doe', role: 'customer' },
    { id: 2, name: 'Jane Smith', role: 'seller' },
    { id: 3, name: 'Bob Johnson', role: 'expert' },
    // Add more users as needed
];

// Function to create a new blog post (only customers can post)
function createBlog(userId, title, content) {
    const user = users.find(user => user.id === userId);
    if (!user) {
        throw new Error('User not found');
    }
    if (user.role !== 'customer') {
        throw new Error('Only customers can create blog posts');
    }

    const newBlog = {
        id: blogs.length + 1,
        title,
        content,
        author: user.name,
        authorRole: user.role,
        date: new Date().toISOString(),
    };
    blogs.push(newBlog);
    return newBlog;
}

// Function to get all blog posts
function getAllBlogs() {
    return blogs;
}

// Function to get a blog post by ID
function getBlogById(id) {
    return blogs.find(blog => blog.id === id);
}

// Function to update a blog post by ID (only the author can update their post)
function updateBlog(userId, blogId, updatedContent) {
    const blog = getBlogById(blogId);
    if (!blog) {
        throw new Error('Blog post not found');
    }
    const user = users.find(user => user.id === userId);
    if (!user || blog.author !== user.name) {
        throw new Error('You can only update your own blog posts');
    }

    blog.content = updatedContent;
    blog.date = new Date().toISOString();
    return blog;
}

// Function to delete a blog post by ID (only the author can delete their post)
function deleteBlog(userId, blogId) {
    const blog = getBlogById(blogId);
    if (!blog) {
        throw new Error('Blog post not found');
    }
    const user = users.find(user => user.id === userId);
    if (!user || blog.author !== user.name) {
        throw new Error('You can only delete your own blog posts');
    }

    const index = blogs.findIndex(blog => blog.id === blogId);
    return blogs.splice(index, 1);
}

// Export the functions to use them in other parts of the application
module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
};
