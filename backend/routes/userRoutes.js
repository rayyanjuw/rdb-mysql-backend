const express = require('express')
const authorize = require('../middlewares/authorize')
const authenticate = require('../middlewares/auth')
const {
    createUser,updateUser,deleteUser, getUser, getAllUsers} = require('../contollers/userControllers')

const router = express.Router();



// router.use(authenticate); 

// Admin or Manager or FacultyHead or DeptHead can create users
// router.post('/create', authorize(['admin', 'manager', 'facultyHead', 'deptHead']), userController.createUser);
router.post('/create', authenticate, authorize(['admin','manager', 'facultyHead', 'deptHead', 'researcher']), createUser);

// Admin or Manager or FacultyHead or DeptHead can update users
router.put('/update/:id',authenticate,  updateUser);

// Admin or Manager or FacultyHead or DeptHead can delete users
router.delete('/delete/:id',authenticate, authorize(['admin', 'manager']), deleteUser);

// All roles can get their own data
router.get('/me/:id',authenticate, authorize(['admin', 'manager', 'facultyHead', 'deptHead', 'researcher']), getUser);

router.get('/allUsers',authenticate, authorize(['admin', 'manager', 'facultyHead', 'deptHead', 'researcher']), getAllUsers )

// Admin or Manager can get all users
// router.get('/', authorize(['admin', 'manager']), userController.getAllUsers);



module.exports = router