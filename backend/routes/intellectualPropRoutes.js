const express = require('express');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const { createIP, getIPById, getallIp, updateIP, deleteIP } = require('../contollers/intellectualPropertyController');


const router = express.Router();


router.post('/create', authenticate, createIP)
router.get('/getallIp', authenticate, getallIp)
router.get('/getByIp/:id', authenticate, getIPById)
router.put('/update/:id', authenticate, updateIP)
router.delete('/delete/:id', authenticate, deleteIP)

module.exports = router