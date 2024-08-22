const express = require('express');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

const {createPublication, getAllPublications, getPublicationById, getUserPublications, updatePublication, deletePublication  } = require('../contollers/PublicationControllers');


const router = express.Router();


router.post('/create', authenticate, authorize(['admin', 'manager', 'facultyHead', 'deptHead', 'researcher']), createPublication)

router.get('/getAllPublications', authenticate,  getAllPublications);

router.get('/userPublications', authenticate,  getUserPublications);

router.get('/publicaionbyId/:id', authenticate, getPublicationById);

router.put('/update/:id', authenticate, authorize(['admin', 'manager', 'facultyHead', 'deptHead', 'researcher']),  updatePublication);

router.delete('/delete/:id', authenticate, authorize(['admin', 'manager', 'facultyHead', 'deptHead', 'researcher']), deletePublication);



module.exports = router