const mongoose = require('../db/conn')
const {Schema} = mongoose;

const UserSchema = mongoose.model('User', new Schema(
    {
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        email: {type: String, required: true},
        avatar: {type: String},
        phone: {type: String, required: true},
        address: {type: String, required: true},
        shopping: {type: Array},
    },
    {timestamps: true},
));

module.exports = UserSchema;