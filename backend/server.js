const http = require("http");
const app = require("./app");

//renvoi d'un port valide fourni soous forme d'un numero ou d'une chaine
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || process.env.SERVER_CONNECT);
app.set("port", port);
//recherche erreur et gestion puis enregistre dans le serveur
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};
/**
 * createServer() reagi au requêtes entrantes et reçoi comme
 * arguments : l'objet requête/responce/next
 */
const server = http.createServer(app);
//ecouteur d'evenement enregistré consignant le port ou le canal sur lequel le serveur s'execute
server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

server.listen(port);
