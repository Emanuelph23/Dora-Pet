const jwt = require('jsonwebtoken');

const User = require('../models/User');

//Get user by token
const getUserByToken = async (token) => {

    if(!token){
        return res.status(401).json({message: 'Você precisa estar logado para acessar essa página!'});
    }

    const decoded = jwt.verify(token, 'secret');

    const userId = decoded.id;

    const user = await User.findById({_id: userId})

    return user;
}

module.exports = getUserByToken;