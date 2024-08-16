const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        validate: {
            validator: (v) => v.length > 0,
            message: 'Title cannot be empty'
        }
    },
    content: {
        type: String,
        required: true,
        validate: {
            validator: (v) => v.length > 0,
            message: 'Content cannot be empty'
        }
    },
    author: {
        type: String,
        required: true
    },
    authorRole: {
        type: String,
        required: true,
        enum: ['Customer', 'Seller', 'Expert']
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
