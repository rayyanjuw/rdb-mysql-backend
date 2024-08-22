const express = require("express")
const login = require('../contollers/authControllers')

const router = express.Router();

router.post('/login', login);

module.exports = router;