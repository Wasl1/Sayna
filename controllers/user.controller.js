const UserModel = require("../models/user.model");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports.getAllUsers = async (req, res) => {
    let token = jwt.verify(req.params.token, process.env.ACCESS_TOKEN_SECRET, (err) => {
        if (err) {
            return res.status(401).send({
                error: true,
                message: err.message.includes("jwt expired") ? "Votre token n'est plus valide, veillez le reinitialiser" : "Le token envoyé n'existe pas"
            })
        }
    });
    if(!token) {
        const users = await UserModel.find().select('-date_naissance').select('-createdAt');
        res.status(200).json({
            error: false,
            users: users
        });
    }
    return token;
};

module.exports.userByToken = (req, res) => {
    jwt.verify(req.params.token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(401).send({
                error: true,
                message: err.message.includes("jwt expired") ? "Votre token n'est plus valide, veillez le reinitialiser" : "Le token envoyé n'existe pas"
            })
        }
        return UserModel.findById(user.id, (err, docs) => {
            if(!err) res.send({
                error: false,
                user: docs
            });
        });
    });
};

module.exports.updateUser = async (req, res) => {
    await jwt.verify(req.params.token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(401).send({
                error: true,
                message: err.message.includes("jwt expired") ? "Votre token n'est plus valide, veillez le reinitialiser" : "Le token envoyé n'existe pas"
            })
        }

        try {
            UserModel.findByIdAndUpdate(
                {_id: user.id},
                req.body,
                { new: true},
                (err) => {
                    if(!err) {
                        if(Object.entries(req.body).length === 0) {
                            return res.send({
                                error: false,
                                message: "Aucune donnée"
                            });
                        }
                        return res.send({
                            error: false,
                            message: "L'utilisateur a été modifié avec succés"
                        });
                    }

                    if(err) 
                    console.log(err);
                    return res.status(401).send({ message: err});
                }
            )
        } catch (err) {
            return res.status(401).json({ message: err})
        }    
    });
};

module.exports.updatePassword = async (req, res) => {
    await jwt.verify(req.params.token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(401).send({
                error: true,
                message: err.message.includes("jwt expired") ? "Votre token n'est plus valide, veillez le reinitialiser" : "Le token envoyé n'existe pas"
            })
        }
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                res.status(401).send({
                    error: true,
                    message: err
                })
            }
            req.body.password = hash;
            console.log("Password", req.body.password )
            try {
                UserModel.findByIdAndUpdate(
                    {_id: user.id},
                    req.body,
                    { new: true},
                    (err) => {
                        if(!err) {
                            if(Object.entries(req.body).length === 0) {
                                return res.send({
                                    error: false,
                                    message: "Aucune donnée"
                                });
                            }
                            return res.send({
                                error: false,
                                message: "L'utilisateur a été modifié avec succés"
                            });
                        }
    
                        if(err) 
                        console.log(err);
                        return res.status(401).send({ message: err});
                    }
                )
            } catch (err) {
                return res.status(401).json({ message: err})
            }  
        });

    });

};

module.exports.deleteUSer = (req, res) => {
    jwt.verify(req.params.token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(401).send({
                error: true,
                message: err.message.includes("jwt expired") ? "Votre token n'est plus valide, veillez le reinitialiser" : "Le token envoyé n'existe pas"
            })
        }
        try {
            UserModel.remove({ _id: user.id}).exec();
            res.status(200).json({ 
                error: false,
                message: "L'utlisateur a été supprimé avec succés"
            });
        } catch (err) {
            return res.status(500).json({ message: err});
        }
    });
  
};