const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

//Acessa usuario
router.post("/login", userController.login);
//Acessa usuario com token
router.get("/getUser",userController.authenticator, userController.getUserData );
//registra usuario
router.post("/register", userController.createUser);
// recebe um usuario
router.get("/user", userController.authenticator, userController.getUser);
//recebe todos usuarios
router.get("/user/all",userController.authenticator,userController.getAllUsers);
//Altera usuario
router.patch(`/user/:userId`, userController.authenticator, userController.updateUser);
//Muda permissão
router.patch(`/user/change-role/:userId`, userController.authenticator, userController.updateUserRole);
//deleta usuario
router.delete(`/user/:userId`, userController.authenticator, userController.deleteUser);

module.exports = router;
