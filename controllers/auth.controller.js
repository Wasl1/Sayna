const UserModel = require('../models/user.model');
const {registerErrors} = require('../utils/errors.utils');
const jwt = require('jsonwebtoken');

const maxAgeAccessToken = '1800s';
const maxAgeRefreshToken = '1d';
const createAccessToken = (id) => {
    return jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: maxAgeAccessToken
    })
};

const createRefreshToken = (id) => {
    return jwt.sign({id}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: maxAgeRefreshToken
    })
};

module.exports.register = async (req, res) => {
    const {firstname, lastname, email, password, date_naissance, sexe} = req.body;
    
    try {
        const user = await UserModel.create({ firstname, lastname, email, password, date_naissance, sexe });
        const accessToken = createAccessToken(user._id);
        const refreshToken = createRefreshToken(user._id);
        res.status(201).json(
                {
                    error: false,
                    message: "L'utilisateur a bien été créé avec succés",
                    tokens: {
                        accessToken,
                        refreshToken
                    } 
                }
            );
    }
    catch(err) {
        const errors = registerErrors(err);
        res.status(401).send(
            {
                error: true,
                message: errors
            });
    }
};

module.exports.login = async (req, res) => {
    const { email, password } = req.body
  
    try {
      const user = await UserModel.login(email, password);
      const accessToken = createAccessToken(user._id);
      const refreshToken = createRefreshToken(user._id);
      res.status(200).json(
          {
            error: false,
            message: "L'utilisateur a été authentifié avec succés",
            tokens: {
                accessToken,
                refreshToken
            }
        }
        )
    } catch (err){
        console.log(err);
      res.status(400).json(
          {
              error: true,
              message: "Votre email ou password est erroné"
          }
      );
    }
}

module.exports.refreshToken = (req, res) => {
    const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.sendStatus(401);
    }
  
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(401).send({
            error: true,
            message: "Le token envoyé n'existe pas"
        });
      }

      delete user.id.iat;
      delete user.id.exp;
      const refreshedToken = createAccessToken(user._id);
      res.send({
        error: false,
        accessToken: refreshedToken,
      });
    });
}
