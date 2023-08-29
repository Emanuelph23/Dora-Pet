const User = require('../models/User');

const checkUserExists = async (email) => {

    const emailLower = email.toLowerCase();

    const user = await User.findOne({email: emailLower});

    if(user) {
        return true;
    }

}

module.exports = checkUserExists;