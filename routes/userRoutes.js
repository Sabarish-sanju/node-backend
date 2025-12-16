const express = require("express");
const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  editUser,
  LoginUser,
} = require("../Controller/UserController.js");
const router = express.Router();
router.post("/login", LoginUser);
router.post("/users", createUser);
router.get("/all", getUser);
router.get("/edit/:id", editUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
module.exports = router;
