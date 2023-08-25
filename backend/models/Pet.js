const mongoose = require('../db/conn');
const {Schema} = mongoose;

const PetSchema = mongoose.model('Pet', new Schema(
    {
        petname: {type: String, required: true},
        age: {type: Number, required: true},
        weight: {type: Number, required: true},
        coat: {type: String, required: true},
        imagespet: {type: Array, required: true},
        avaliable: {type: Boolean, required: true},
        user: Object,
        adopter: Object
    },
    {timestamps: true}
));

module.exports = PetSchema;