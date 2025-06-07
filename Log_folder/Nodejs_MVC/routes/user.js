const express = require("express");
const {getAllUsers, getUserById, DeleteUserById, CreateUser} = require("../controllers/user");
const router = express.Router();

router.route("/").get(getAllUsers).post(CreateUser);

router
  .route("/:id")
  .get(getUserById)
  .delete(DeleteUserById);

module.exports = router; 