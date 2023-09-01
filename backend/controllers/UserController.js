//Helpers
const createUserToken = require('../helpers/create-user-token');
const checkUserExists = require('../helpers/check-user-exists');
const checkPassword = require('../helpers/check-password');
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const getProductById = require('../helpers/get-product-by-id');
//Models
const User = require('../models/User');
//Libs
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;

class UserController {

    static async register(req, res) {
        
        const { username, email, phone, address, password, confirmPassword} = req.body;

        //Convert username and email to lowercase
        const usernameLower = username.toLowerCase();
        const emailLower = email.toLowerCase();

        // Validations
        switch (true) {
            case !username:
                return res.status(422).json({message: 'O campo Nome é obrigatório!'});
            case !email:
                return res.status(422).json({message: 'O campo E-mail é obrigatório!'});
            case !phone:
                return res.status(422).json({message: 'O campo Telefone é obrigatório!'});
            case !address:
                return res.status(422).json({message: 'O campo Endereço é obrigatório!'});
            case !password:
                return res.status(422).json({message: 'O campo Senha é obrigatório!'});
            case !confirmPassword:
                return res.status(422).json({message: 'A confirmação de senha é obrigatória!'});
            case password !== confirmPassword:
                return res.status(422).json({message: 'As senhas não conferem!'});
        }   

        //Check if username already exists
        const nameExists = await User.findOne({username: usernameLower});

        if(nameExists) {
            return res.status(422).json({message: 'Usuário já cadastrado!'});
        }

        //Check if email already exists
        const emailExists =  await checkUserExists(email);

        if(emailExists) {
            return res.status(422).json({message: 'E-mail já cadastrado!'});
        }

        //Create password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        //Create user
        const user = new User({
            username: usernameLower,
            email: emailLower,
            phone,
            address,
            password: hashPassword,
        });

        //Save user
        try {
            const savedUser = await user.save();
            
            await createUserToken(savedUser, req, res)

        } catch (error) {
            res.status(500).json({message: error});
        }

    }

    static async login(req, res) {

        const { email, password } = req.body;

        //Validations
        switch(true) {
            case !email:
                return res.status(422).json({message: 'O campo E-mail é obrigatório!'});
            case !password:
                return res.status(422).json({message: 'O campo Senha é obrigatório!'});
        }

        //Check if user exists
        const user = await checkUserExists(email);

        if(!user){
            return res.status(422).json({message: 'Usuário ou Senha inválidos!'});
        }

        //Check password
        await checkPassword(password, email, req, res)

    }

    static async checkUser(req, res) {

        let currentUser

        if(req.headers.authorization) {
           
            const token = getToken(req)
            const decoded = jwt.verify(token, 'secret');

            currentUser = await User.findById(decoded.id);

            currentUser.password = undefined;

        } else {
            currentUser = null;
        }

        res.status(200).send(currentUser);

    }

    static async getUserById(req,res){

        const id = req.params.id;

        const user = await User.findById(id).select('-password');

        if(!user){
            res.status(404).json({message: 'Usuário não encontrado!'});
            return;
        }

        res.status(200).json({user});

    }

    static async editUser(req, res) {

        //Check if user exists
        const token = getToken(req)
        const user = await getUserByToken(token)

        const { username, email, phone, address, password, confirmPassword} = req.body;

        if(req.file) {
            user.avatar = req.file.filename;
        }

        // Validations
        switch (true) {
            case !username:
                return res.status(422).json({message: 'O campo Nome é obrigatório!'});
            case !email:
                return res.status(422).json({message: 'O campo E-mail é obrigatório!'});
            case !phone:
                return res.status(422).json({message: 'O campo Telefone é obrigatório!'});
            case !address:
                return res.status(422).json({message: 'O campo Endereço é obrigatório!'});
            case !password:
                return res.status(422).json({message: 'O campo Senha é obrigatório!'});
            case !confirmPassword:
                return res.status(422).json({message: 'A confirmação de senha é obrigatória!'});
            case password !== confirmPassword:
                return res.status(422).json({message: 'As senhas não conferem!'});
        }

        //Check if email already exists
        const userExists =  await checkUserExists(email);

        if(user.email !== email && userExists) {
            return res.status(422).json({message: 'Por favor, utilize outro e-mail!'});
        }

        //Update user
        user.username = username;
        user.email = email;
        user.phone = phone;
        user.address = address;

        if(password === confirmPassword && password !== null){
            
            //Create password
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);

            user.password = hashPassword;
        }

        try {
            
            await User.findOneAndUpdate({_id: user._id}, {$set: user}, {new: true})

            res.status(200).json({message: 'Usuário atualizado com sucesso!'});

        } catch (error) {
            res.status(500).json({message: error});
            return
        }
    }

    static async shoppingUser(req, res){

        //Get user By Token
        const token = getToken(req)
        const user = await getUserByToken(token)

        //Check if ID is valid
        const id = req.params.id;

        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: 'ID inválido'});
            return
        }

        //Get product By Id
        const product = await getProductById(id, req, res);

        //Add product to user
        try {
            
            await User.findOneAndUpdate({_id: user._id}, {$push: {shopping: product}}, {new: true})

            res.status(200).json({message: 'Produto adicionado ao carrinho com sucesso!'});

        } catch (error) {
            res.status(500).json({message: error});
        }
    }
    
}

module.exports = UserController;
