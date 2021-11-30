const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./routes/product');
const userRoutes = require('./routes/user');
/************************************************** */
//logique de connexion a mongodb
mongoose.connect('mongodb+srv://ALEXANDRE:cerche@cluster0.gufrz.mongodb.net/test',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
const app = express();
//requete POST intercepte tous ce qui contient du json(acces au corps de la reqête)
//plus besoin d'utiliser bodyparser qui est une ancienne methode
app.use(express.json());
/*************************************************** */
//CORS
//par defaut les requêtes ajax sont interdites
//permission a l'appication d'accéder a l'api avec les headers spécifiques
//evite les erreurs liées quand le client ne partage pas les serveur de la mê origine
//configure des headers specifiques a l'objet responce
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
app.use(bodyParser.json());
app.use('/api/sauces',productRoutes);
app.use('/api/auth',userRoutes);

module.exports = app;