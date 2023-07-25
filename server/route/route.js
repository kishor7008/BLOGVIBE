const express = require("express");
const {
  register,
  login,
  getAll,
  profile,
  updateProfile,
  createBlog,
  loginBoth,
  checkBoth,
  updateBlog,
} = require("../Controller/userController");
const { auth } = require("../middleware/middleware");
const { adminRegister } = require("../Controller/adminController");
const route = express.Router();
route.post("/register", register);

// route.post("/login", login);
route.get("/getAll", auth, getAll);
route.get("/profile", auth, profile);
route.put("/updateProfile", auth, updateProfile);
route.post("/create/blog", auth, createBlog);

//..............................  Admin Section ......................

route.post("/admin/register", adminRegister);

// .............................. find both [admin and user] in login.............................

route.post("/Check/login", checkBoth);
route.post("/findBothLogin", loginBoth);

//  ............................ Blog Section......................

route.put("/updateBlog/:id", auth, updateBlog);

module.exports = { route };
