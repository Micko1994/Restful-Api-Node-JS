# Restful-Api-Node-JS
This project was created with Node.js.

For running server side will need only this two commands:

npm i is a for getting node_modules.
npm start is a command for running project.

Server listen http://localhost:8000 to view it in the browser.

Package.json

{
  "name": "login-with-node",
  "version": "1.0.0",
  "description": "a node js",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon index"
  },
  "author": "Mickael",
  "license": "ISC",
  "dependencies": {
    "bcrypt": "^3.0.4",
    "body-parser": "^1.18.3",
    "express": "^4.16.4",
    "jsonwebtoken": "^8.5.0",
    "mongoose": "^5.4.19",
    "morgan": "^1.9.1",
    "multer": "^1.4.1"
  },
  "devDependencies": {
    "nodemon": "^1.18.10"
  }
}



