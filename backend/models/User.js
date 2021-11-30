const mongoose = require('mongoose');
//installation  package // npm install --save mongoose-unique-validator  
const uniqueValidator = require('mongoose-unique-validator');
//création du schéme User
//unique:true empeche des connections avec la meme adresse
const userSchema = mongoose.Schema({
        email: {type: String, required:true, unique: true},
        password: {type: String, required:true},

});
//methode plugin validation sécurité 
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User',userSchema);