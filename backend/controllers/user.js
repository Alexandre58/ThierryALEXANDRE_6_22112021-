const bcrypt = require('bcrypt');
const User = require('../models/User');
//installation bcrypt //npm install --save bcript

//hashage du mot de passe
exports.signup =(req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email:req.body.email,
            password: hash
        });
        user.save()
        .then(()=> res.statu(201).json({message : 'Nouveau utilisateur crée'}))
        .catch(error => res.statu
            (400).json({error}));
    })
    .catch(error => res.statu
        (500).json({error}));
}
/***********function login */
exports.login =(req, res, next) => {
    //recup utilisateur
    //if user !user =>error
    //compare mot de pass entré avec celui de la base de donnée/ if !valid =>error
    //if valid renvoi un userId et un token
    User.findOne({email: req.body.email})
    .then(user => {
        if(!user) {
            return res.status(401).json({error: 'pas d\'utilisateur trouvé'});
        }
        bcrypt.compare(req.body.password, user.password)
             .then(valid => {
                 if(!valid){
                     return res.status(401).json({error: 'Le mot de passe n\'est pas valide'});
                 }
                 res.status(200).json({
                     userId: user._id,
                     token: 'TOKEN'
                 });
             })
             .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};
