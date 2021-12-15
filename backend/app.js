require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
//accés chemin images
const path = require("path");
//import routes 
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");
/**************************************************Express **/
const app = express();
/********************************************************** */
app.use(express.json());//gestion de la requête POST venant de l'application front-end, extraction du corps JSON
/**************************************************** *******/
//logique de connexion a mongodb atlas et sécurisation par une variable d'environnement
mongoose
  .connect(
    process.env.APP_CONNECT_MONGOD,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
console.log(`Le code de connexion protégé et vérification du bon fonctionnement de dotenv : ${process.env.APP_CONNECT_MONGOD}`);

/*************************************************** *************************************************************/
//CORS code permettant de faire fonctionné deux adresses differentes backend et frontend de ce cas,premier middleware d'accés 
//par defaut les requêtes ajax sont interdites
//permission a l'appication d'accéder a l'api avec les headers spécifiques
//evite les erreurs liées quand le client ne partage pas les serveur de la même origine
//configure des headers specifiques a l'objet responce
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");//origin = * => tout le monde peut accéder
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );//autorisation de certains hearders
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );//autorise ces methodes
  next();
});
/******************************************************************************************************************** */
/* Middleware Conversion des fichiers JSON pour l'import de données */
app.use(bodyParser.json());
/******************************************************** */
//Middleware images
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", productRoutes);
app.use("/api/auth", userRoutes);


/*test de code pour postman**************************************************/
/*app.use((req, res, next)=> {
  console.log("requête reçue ligne 13 fichier app.js");
  next();
})
app.use((req, res, next)=> {
  res.json({message: "requête reçue app.js ligne 14"})
  
})*/
                                      
/*fin test de code pour postman**********************************************/
module.exports = app;
