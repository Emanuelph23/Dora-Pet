const Pet = require('../models/Pet');

//Helpers
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');

//Middleware
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = class PetsController {

    static async createPet(req, res) {
        
        const {petname, age, weight, coat} = req.body;

        const imagespet = req.files

        const avaliable = true;

        //Validations
        if(!petname) {
            res.status(422).json({message: 'O nome do pet é obrigatório'});
            return
        }
        if(!age) {
            res.status(422).json({message: 'A idade do pet é obrigatória'});
            return
        }
        if(!weight) {
            res.status(422).json({message: 'O peso do pet é obrigatório'});
            return
        }
        if(!coat) {
            res.status(422).json({message: 'A cor do pet é obrigatória'});
            return
        }
        if(imagespet.length === 0) {
            res.status(422).json({message: 'A imagem do pet é obrigatória'});
            return
        }

        //Get user owner of the pet '
        const token = getToken(req);
        const user = await getUserByToken(token);

        //Create Pet
        const pet = new Pet({
            petname,
            age,
            weight,
            coat,
            imagespet: [],
            avaliable,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                avatar: user.avatar
            }
        });

        imagespet.map((image) => {
            pet.imagespet.push(image.filename)
        })

        try {
            
            const newPet = await pet.save();
            res.status(201).json({message: 'Pet cadastrado com sucesso', newPet});

        } catch (error) {
            res.status(500).json({message: error});
        }
    }

    static async listPets(req, res) {

        const pets = await Pet.find().sort('-createdAt');

        res.status(200).json({pets});

    }

    static async getAllUserPets(req, res) {

        //Get User Token
        const token = getToken(req);
        const user = await getUserByToken(token);

        const pets = await Pet.find({'user._id': user._id}).sort('-createdAt');

        res.status(200).json({pets});

    }

    static async getAllUserAdoptions(req, res) {

        //Get User Token
        const token = getToken(req);
        const adpoter = await getUserByToken(token);

        const pets = await Pet.find({'adopter._id': adpoter._id}).sort('-createdAt');

        res.status(200).json({pets});

    }

    static async getPetById(req, res) {

        const id = req.params.id;

        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: 'ID inválido'});
            return
        }

        //Get Pet
        const pet = await Pet.findOne({_id: id});

        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado'});
            return
        }

        res.status(200).json({pet});
    }

    static async removePetById(req, res) {

        const id = req.params.id;

        //Check if ID is valid
        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: 'ID inválido'});
            return
        }

        //Check if Pet exists
        const pet = await Pet.findOne({_id: id});

        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado'});
            return
        }

        //Check if logged user is the pet owner
        const token = getToken(req);
        const user = await getUserByToken(token);

        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({message: 'Você não tem permissão para remover este pet'});
            return
        }

        //Remove Pet
        try {

            await Pet.findByIdAndRemove(id)
            res.status(200).json({message: 'Pet removido com sucesso'});

        } catch (error) {
            res.status(500).json({message: error});
        }
        
    }

    static async updatePet(req, res) {

        const id = req.params.id;

        //Check if ID is valid
        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: 'ID inválido'});
            return
        }

        const {petname, age, weight, coat} = req.body;

        const imagespet = req.files

        const updatedData = {}

        //Check if Pet exists
        const pet = await Pet.findOne({_id: id});

        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado'});
            return
        }

        //Check if logged user is the pet owner
        const token = getToken(req);
        const user = await getUserByToken(token);

        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({message: 'Você não tem permissão para atualizar este pet'});
            return
        }

        //Validations
        if(!petname) {
            res.status(422).json({message: 'O nome do pet é obrigatório'});
            return
        }else {
            updatedData.petname = petname;
        }

        if(!age) {
            res.status(422).json({message: 'A idade do pet é obrigatória'});
            return
        }else {
            updatedData.age = age;
        }

        if(!weight) {
            res.status(422).json({message: 'O peso do pet é obrigatório'});
            return
        }else {
            updatedData.weight = weight;
        }

        if(!coat) {
            res.status(422).json({message: 'A cor do pet é obrigatória'});
            return
        }else {
            updatedData.coat = coat;
        }

        if(imagespet.length === 0) {
            res.status(422).json({message: 'A imagem do pet é obrigatória'});
            return
        }else{
            updatedData.imagespet = [];
            imagespet.map((image) => {
                updatedData.imagespet.push(image.filename)
            })
        }

        try {
            
            await Pet.findByIdAndUpdate(id, updatedData);
            res.status(200).json({message: 'Pet atualizado com sucesso!'});

        } catch (error) {
            res.status(500).json({message: error});
        }

    }

    static async scheduleAdoption(req, res) {

        const id = req.params.id;

        //Check if ID is valid
        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: 'ID inválido'});
            return
        }

        //Check if Pet exists
        const pet = await Pet.findOne({_id: id});

        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado'});
            return
        }

        //Check if user registered the pet
        const token = getToken(req);
        const user = await getUserByToken(token);

        if(pet.user._id.equals(user._id)) {
            res.status(422).json({message: 'Você não pode agendar uma visita com o seu próprio pet'});
            return
        }

        //Check if user has already scheduled a visit
        if(pet.adopter) {
            if(pet.adopter._id.equals(user._id)) {
                res.status(422).json({message: 'Você já agendou uma visita com este pet'});
                return
            }
        }

        //Add adopter to pet
        pet.adopter = {
            _id: user._id,
            name: user.username,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar
        }

        try {

            await Pet.findByIdAndUpdate(id, pet);
            res.status(200).json({message: `Visita agendada com sucesso! Entre em contato pelo E-mail: ${pet.user.email} do proprietário do pet ou pelo telefone: ${pet.user.phone} para combinar os detalhes da visita.`});

        } catch (error) {
            res.status(500).json({message: error});
        }
    }

    static async concludeScheduleAdoption(req, res){

        const id = req.params.id;

        //Check if Pet exists
        const pet = await Pet.findOne({_id: id});

        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado'});
            return
        }

        //Check if logged user is the pet owner
        const token = getToken(req);
        const user = await getUserByToken(token);

        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({message: 'Houve um problema no processamento da sua requisição! Tente novamente mais tarde!'});
            return
        }

        try {
            
            pet.avaliable = false;

            await Pet.findByIdAndUpdate(id, pet);
            res.status(200).json({message: 'Parabéns! O seu Pet foi adotado. Obrigado por utilizar a DoraPet!'});
            
        } catch (error) {
            res.status(500).json({message: error});
        }

    }
}