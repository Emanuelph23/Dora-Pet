//Model
const Product = require('../models/Ecommerce');

//Middleware
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = class EcommerceController {

    static async createProduct(req, res) {

        const { productname, price, description } = req.body;

        //Check Images of product was sent
        const imagesProduct = req.files;

        if(!imagesProduct) {
            return res.status(422).json({ message: 'O campo Imagens do produto é obrigatório!' });
        }

        //Validations
        switch (true) {
            case !productname:
                return res.status(422).json({ message: 'O campo Nome do produto é obrigatório!' });
            case !price:
                return res.status(422).json({ message: 'O campo Preço produto é obrigatório!' });
            case !description:
                return res.status(422).json({ message: 'O campo Descrição é obrigatório!' });
        }

        //Create product
        const product = new Product({
            productname,
            price,
            imagesProduct: [],
            description
        });

        imagesProduct.map(image => {
           product.imagesProduct.push(image.filename); 
        });

        try {

            await product.save();
            res.status(201).json({ message: 'Produto cadastrado com sucesso!'});

        } catch (error) {
            res.status(500).json({ message: 'Erro ao cadastrar produto!', error });
        }
    }

    static async listProducts(req, res) {

        try {

            const products = await Product.find();
            res.status(200).json({ products });

        } catch (error) {
            res.status(500).json({ message: 'Erro ao listar produtos!', error });
        }

    }

    static async deleteProduct(req, res) {

        const id = req.params.id;

        //Check product exists
        const product = await Product.findById(id);

        if(!product) {
            return res.status(404).json({ message: 'Produto não encontrado!' });
        }

        try {
            await Product.findByIdAndDelete(id);
            res.status(200).json({ message: 'Produto excluído com sucesso!' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao excluir produto!', error });
        }
    }

    static async updateProduct(req, res) {

        const id = req.params.id;

        //Check if ID is valid
        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: 'ID inválido'});
            return
        }

        const { productname, price, description } = req.body;

        const imagesProduct = req.files;

        const updateData = {};

        //Validations
        if(!productname){
            return res.status(422).json({ message: 'O campo Nome do produto é obrigatório!' });
        } else {
            updateData.productname = productname;
        }

        if(!price){
            return res.status(422).json({ message: 'O campo Preço do produto é obrigatório!' });
        } else {
            updateData.price = price;
        }

        if(imagesProduct.length === 0){
            return res.status(422).json({ message: 'O campo Imagens do produto é obrigatório!' });
        } else {
            updateData.imagesProduct = [];
            imagesProduct.map(image => {
                updateData.imagesProduct.push(image.filename); 
            });
        }

        if(!description){
            return res.status(422).json({ message: 'A descrição do produto é obrigatória!' });
        } else {
            updateData.description = description;
        }

        try {
            
            await Product.findByIdAndUpdate(id, updateData)
            res.status(200).json({ message: 'Produto atualizado com sucesso!' });

        } catch (error) {
            res.status(500).json({message: error});
        }

    }

}