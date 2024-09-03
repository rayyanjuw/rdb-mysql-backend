const express = require("express")
const {login, impersonateUser} = require('../contollers/authControllers');
const authenticate = require('../middlewares/auth')
const authorize = require('../middlewares/authorize')

const router = express.Router();

router.post('/login', login);
router.post('/impersonate/:userId', authenticate, authorize(['admin', 'manager', 'dean', 'chairperson']), impersonateUser)

module.exports = router;