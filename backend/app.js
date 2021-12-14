require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
//accés chemin images
const path = require("path");

const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");

/************************************************** */
const app = express();

app.use(express.json());
//logique de connexion a mongodb
mongoose
  .connect(
    process.env.APP_CONNECT_MONGOD,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//requete POST intercepte tous ce qui contient du json(acces au corps de la reqête)
//plus besoin d'utiliser bodyparser qui est une ancienne methode

/*************************************************** */
//CORS
//par defaut les requêtes ajax sont interdites
//permission a l'appication d'accéder a l'api avec les headers spécifiques
//evite les erreurs liées quand le client ne partage pas les serveur de la mê origine
//configure des headers specifiques a l'objet responce
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});


/* Conversion des fichiers JSON pour l'import de données */
app.use(bodyParser.json());
//images

app.use("/images", express.static(path.join(__dirname, "images")));
              /*test de code pour debugger**************************************************/
/*app.use((req, res, next)=> {
  console.log("requête reçue ligne 13 fichier app.js");
  next();
})
app.use((req, res, next)=> {
  res.json({message: "requête reçue app.js ligne 14"})
  
})*/
                                      
            /*fin test de code pour debugger**********************************************/
app.use("/api/sauces", productRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
