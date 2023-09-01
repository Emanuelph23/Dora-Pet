const Product = require('../models/Ecommerce');

const getProductById = async (id, req, res) => {

    const product = await Product.findById(id);

    if(!product){
        res.status(404).json({message: 'Produto não encontrado!'});
        return;
    }

    return product;

}

module.exports = getProductById;