const express = require("express");
const userRouter = express.Router();
const userController = require("../controller/user.controller");
const { validateUser, auth } = require("../middelware/user.Validator");

userRouter
  .route("/users")
  .post(validateUser, userController.register)
  .patch(auth, userController.updateUser)
  .delete(auth, userController.deleteUser)
  .get(auth, userController.getUser);

userRouter.route("/login").post(userController.login);

userRouter.route("/").get((req, res) => {
  res.json({ message: "hello from user router" });
});

module.exports = userRouter;
