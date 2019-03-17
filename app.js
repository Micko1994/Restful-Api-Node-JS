const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require("morgan");
const mongoose = require('mongoose');

// const productRoutes = require('./api/routes/products');
const postRoutes = require('./api/routes/posts');
const userRoutes = require('./api/routes/users');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/login-mongodb', {
    useNewUrlParser: true
})
    .then(() => console.log('MongoDB has started sucsessful'))
    .catch((err) => console.log(err));

app.use("/uploads", express.static('uploads'))
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use('/products', productRoutes);
app.use('/posts', postRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});


app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})


module.exports = app;
