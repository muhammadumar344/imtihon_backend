const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userCtrl");


router.get("/user/:id", userCtrl.getUser);

module.exports = router; 
 