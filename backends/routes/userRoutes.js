const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getUsers, createUser } = require("../controllers/userController");

router.get("/", auth, getUsers);
router.post("/", auth, createUser);

module.exports = router;
