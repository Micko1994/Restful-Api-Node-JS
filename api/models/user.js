const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
            `Please fill valid email address`
        ]
    },
    password: { type: String, required: true },
    name: { type: String, require: true },
    surname: {type: String, require: true},
    burnData: {
        type: String,
        required: true,
        unique: true,
        match: [/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/,
            `Please write valid data`
        ]
    },
    userImage: { type: String },
    adress: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);