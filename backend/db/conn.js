const mongoose = require('mongoose');

async function connect() {

    await mongoose.connect('mongodb://127.0.0.1:27017/dora_pet')
    console.log('Connect successfully to Db!')

}

connect()
.catch(err => console.log(err));

module.exports = mongoose;