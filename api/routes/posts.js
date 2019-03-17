const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const jwt = require("jsonwebtoken");
const chechAuth = require("../middlware/checkAuth");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
        cb(null, true);
    cb(null, false)
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter
})

const Post = require("../models/post");

router.get('/', (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    console.log("req.userData", req.userData);
    Post.find()
        .select("postTitle postText postImage")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                posts: docs.map(doc => {
                    return {
                        author: `${req.userData.userName} ${req.userData.userSurname}`,
                        postTitle: doc.postTitle,
                        postText: doc.postText,
                        postImage: doc.postImage,
                        _id: doc._id,
                        request: {
                            type: "GET",
                            url: `http://localhost:8000/posts/${doc._id}`
                        }
                    }
                })
            }
            console.log(docs);
            res.status(200).json(response)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })
})

router.post("/", chechAuth, upload.single('postImage'), (req, res, next) => {
    console.log(req.file)
    const post = new Post({
        _id: new mongoose.Types.ObjectId(),
        postTitle: req.body.postTitle,
        postText: req.body.postText,
        postImage: req.file.path
    });
    post
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Handling POST requests to /posts",
                createdPost: {
                    author: `${req.userData.userName} ${req.userData.userSurname}`,
                    postTitle: result.postTitle,
                    postText: result.postText,
                    postImage: result.postImage,
                    _id: result._id,
                    request: {
                        type: "GET",
                        url: `http://localhost:8000/posts/${result._id}`
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:postId', (req, res, next) => {
    const id = req.params.postId;
    Post.findById(id)
        .select("postTitle postText postImage")
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    author: `${req.userData.userName} ${req.userData.userSurname}`,
                    post: doc,
                    request: {
                        type: "GET",
                        url: "http://localhost:8000/posts"
                    }
                });
            } else {
                res.status(404).json({ message: "No valid entry provided Id" })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
})

router.patch('/:postId', chechAuth, (req, res, next) => {
    const id = req.params.postId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => res.status(200).json({
            message: "Product updated",
            author: `${req.userData.userName} ${req.userData.userSurname}`,
            requests: {
                type: "GET",
                url: `http://localhost:8000/posts/${id}`
            }
        }))
        .catch(err => res.status(500).json({ error: err }))
});

router.delete('/:postId', chechAuth, (req, res, next) => {
    const id = req.params.postId;
    Post.remove({ _id: id })
        .exec()
        .then(result => res.status(200).json({
            message: "Post Delected!!!",
            request: {
                type: "POST",
                url: `http://localhost:8000/posts/`
            }
        }))
        .catch(err => res.status(500).json({ error: err }))
});

module.exports = router;
