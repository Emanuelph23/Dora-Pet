const express = require('express');
const cors = require('cors');

const app = express();

//Conig body-parser
app.use(express.json());

//Config cors
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

//Config public folder
app.use(express.static('public'));

//Config routes

app.listen(5000, () => {
    console.log('Server running on port 5000')
});