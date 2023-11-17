//Create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Comment = require('./models/comment');
const Post = require('./models/post');

mongoose.connect('mongodb://localhost:27017/reddit', {useNewUrlParser: true});

app.use(bodyParser.json());

//Create a comment
app.post('/posts/:postId/comments', (req, res) => {
    const newComment = new Comment(req.body);
    newComment.save((err, savedComment) => {
        if (err) {
            res.status(500).json(err);
        } else {
            Post.findById(req.params.postId, (err, foundPost) => {
                if (err) {
                    res.status(500).json(err);
                } else {
                    foundPost.comments.push(savedComment);
                    foundPost.save((err, savedPost) => {
                        if (err) {
                            res.status(500).json(err);
                        } else {
                            res.status(200).json(savedComment);
                        }
                    })
                }
            })
        }
    })
});

//Get all comments
app.get('/posts/:postId/comments', (req, res) => {
    Post.findById(req.params.postId, (err, foundPost) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(foundPost.comments);
        }
    });
});

//Get a comment
app.get('/posts/:postId/comments/:id', (req, res) => {
    Comment.findById(req.params.id, (err, foundComment) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(foundComment);
        }
    });
});

//Update a comment
app.put('/posts/:postId/comments/:id', (req, res) => {
    Comment.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedComment) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(updatedComment);
        }
    });
});

//Delete a comment
app.delete('/posts/:postId/comments/:id', (req, res) => {
    Comment.findByIdAndRemove(req.params.id, (err, deletedComment) => {
        if (err) {
            res.status(500).json(err);