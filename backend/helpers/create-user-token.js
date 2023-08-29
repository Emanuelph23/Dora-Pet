const jwt = require('jsonwebtoken');

const createUserToken = async(user, req , res) => {

    //Create token
    const token = jwt.sign(
        {
            id: user._id,
            username: user.username,
        }, 
        "secret"
    )

    //Return token
    return res.status(200).json(
        {
            message: 'Usuário logado com sucesso!',
            token: token,
            userId: user._id,
        }
    );

}

module.exports = createUserToken;