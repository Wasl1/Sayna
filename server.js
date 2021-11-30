const express = require('express');
const fs = require('fs');
const path = require('path');
const userController = require('./controllers/user.controller');
const authController = require('./controllers/auth.controller');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
require('dotenv').config({ path: './config/.env' });
require('./config/db');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//route
app.get('/',function(req, res) {
  const indexPage = path.join(__dirname +'\\index.html');
  console.log("CHEMIN", indexPage);
  if (fs.existsSync(indexPage)) {
    res.sendFile(indexPage);
  } else {
    res.sendFile(path.join(__dirname +'\\404.html'));
  }
});
app.post("/register", authController.register);
app.post("/login", authController.login);
app.post("/refreshToken", authController.refreshToken);
app.use('/user', userRoutes);
app.get('/users/:token', userController.getAllUsers);


//server
app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})