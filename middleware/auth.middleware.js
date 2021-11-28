// const jwt = require('jsonwebtoken');
// const {tokenErrors} = require('../utils/errors.utils');

// module.exports.authenticateToken = async (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
  
//     if (!token) {
//       return res.status(401).send(
//           {
//               error: true,
//               message: "Veuillez vous connecter"
//           }
//       );
//     }
  
//     await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         if (err) {
//             // console.log("err",err);
//             const errors = tokenErrors(err);
//             console.log(err);
//             return res.status(401).send({
//                 error: true,
//                 message: err.message.includes("jwt expired") ? "Votre token n'est plus valide" : "Le token envoyé n'existe pas"
//             })
//         }
//         //   if (err.message.includes("jwt expired")) {
//         //     return res.status(401).send({
//         //         error: true,
//         //         message: "Votre token n'est plus valide"
//         //     });
//         //   } else if (err.message.includes("invalid signature")) {
//         //     return res.status(401).send({
//         //         error: true,
//         //         message: "Le token envoyé n'existe pas"
//         //     });
//         //   }

//       req.user = user;
//       next();
//     });
//   }