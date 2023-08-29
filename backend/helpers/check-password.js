const bcrypt = require('bcrypt');
const User = require('../models/User');
const createUserToken = require('../helpers/create-user-token');

const checkPassword = async (password, email, req, res) => {
    try {
        
        const user = await User.findOne({email});

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(422).json({message: 'Usuário ou Senha inválidos!'});
        }

        await createUserToken(user, req, res);

    } catch (error) {

        return res.status(500).json({message: 'Erro interno no servidor.'});
    }
}

module.exports = checkPassword;
