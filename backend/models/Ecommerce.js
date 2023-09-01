const mongoose = require('../db/conn');
const {Schema} = mongoose;

const EcommerceSchema = mongoose.model('Ecommerce', new Schema(
    {
        productname: {type: String, required: true},
        price: {type: Number, required: true},
        imagesProduct: {type: Array, required: true},
        description: {type: String, required: true},
    },
    {timestamps: true}
));

module.exports = EcommerceSchema;