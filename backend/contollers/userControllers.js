const User = require("../Models/userModels");
const allowedRole = require("./../config/roles");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
    console.log('Received request to create user:', req.body);
    try {
        const { name, username, email, password, role, department } = req.body;
        const { role: userRole } = req.user;

       

        // Check if the user has permission to create the role
        if (!allowedRole[userRole].includes(role)) {
            console.log('User does not have permission to create this role');
            return res.status(403).json({ message: "You do not have permission to create this role" });
        }

        // Check if the username already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            console.log('User already exists with username:', username);
            return res.status(400).json({ message: "User already exists" });
        }

      

        console.log('Creating new user...');
        // Create the new user
        await User.create({
            name,
            username,
            password,
            role,
            department,
            email,
        });

        console.log('User created successfully');

        res.status(201).json({ message: `${role} user created successfully`, role });
    } catch (error) {
        console.error('Error creating user:', error); // Log detailed error
        res.status(500).json({ message: "Server error" });
    }
};

const updateUser = async (req, res) => {
    console.log('Received request to update user:', req.body);
    try {
        const { id } = req.params; // User ID to update
        const { name, username, email, password, role, department } = req.body;
        const { role: userRole } = req.user;

        // Check if the user has permission to update
        if (!allowedRole[userRole].includes(role)) {
            return res.status(403).json({ message: 'You do not have permission to update this role' });
        }

        // Find the user by ID
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the username already exists for another user
        if (username && username !== user.username) {
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }
        }

        // Update user details
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }
        user.name = name || user.name;
        user.username = username || user.username;
        user.email = email || user.email;
        user.role = role || user.role;
        user.department = department || user.department;

        await user.save();

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const deleteUser = async (req, res) => {
    console.log('Received request to delete user:', req.params);
    try {
        const { id } = req.params; // User ID to delete
        const { role: userRole } = req.user;

        // Check if the user has permission to delete
        if (!allowedRole[userRole].includes('admin')) {
            return res.status(403).json({ message: 'You do not have permission to delete users' });
        }

        // Find and delete the user
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUser = async (req, res) => {
    console.log('Received request to get user:', req.params);
    try {
        const { id } = req.params; // User ID to get
        const { role: userRole, id: requesterId } = req.user;

        if (userRole === 'admin' || requesterId === parseInt(id, 10)) {
            // Find the user by ID
            const user = await User.findOne({ where: { id } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } else {
            res.status(403).json({ message: 'Not authorized to view this user.' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllUsers = async (req, res) => {
    console.log('Received request to get all users');
    try {
        const { role: currentUserRole } = req.user;

        // Define role-based permissions for viewing users
        const rolePermissions = {
            admin: ['admin', 'manager', 'facultyHead', 'deptHead', 'researcher'],
            manager: ['manager', 'facultyHead', 'deptHead', 'researcher'],
            facultyHead: ['facultyHead', 'deptHead', 'researcher'],
            deptHead: ['deptHead', 'researcher'],
            researcher: [] // Researchers cannot view other users
        };

        // Determine which roles can be viewed by the current user
        const allowedRoles = rolePermissions[currentUserRole] || [];

        // Fetch all users based on role permissions
        let users;
        if (currentUserRole === 'admin') {
            users = await User.findAll(); // Fetch all users
        } else if (allowedRoles.length > 0) {
            users = await User.findAll({
                where: {
                    role: allowedRoles
                }
            });
        } else {
            users = [];
        }

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getAllUsers,
    getUser
};
