"use strict";
const http = require("http");
const app = require("./app");

/****************return of a valid port provided in the form of a number or a string**************/
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
/*************************error search and management then save in the server**********************/
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
 * createServer() react to incoming requests and receive as arguments: the object requête/responce/next
 */
const server = http.createServer(app);
//registered event listener logging the port or channel the server is running on
server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});
server.listen(port);
