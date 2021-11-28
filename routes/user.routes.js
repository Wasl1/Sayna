const router = require('express').Router();
const userController = require('../controllers/user.controller');

//user display: 'block'
router.get("/:token", userController.userByToken);
router.put("/:token", userController.updateUser);
router.put("/updatePassword/:token", userController.updatePassword);
router.delete("/:token", userController.deleteUSer);
router.delete("/:token", userController.deleteUSer);

module.exports = router;