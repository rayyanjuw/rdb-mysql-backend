// const Department = require("../Models/departmentmodel");
const IntellectualProperty = require("../Models/IntellectualProperty");
const Publication = require("../Models/Publication");
// const User = require("../Models/userModels");
const { User, Department} = require('../Models/association')
const {allowedRoles, roleHierarchy} = require("./../config/roles");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
    console.log('Received request to create user:', req.body);
    try {
        const { name, username, email, password, role, departmentName } = req.body;
        const { role: userRole} = req.user;
        
        if(!departmentName) return res.status(400).json({ message: 'Department name is required'});
        
        //Find the department 
        const department = await Department.findOne({ where: {name: departmentName}});
        if(!department) return res.status(404).json({ message: 'Department not found'});
        
        const departmentId = department.id

        // Check if the user has permission to create the role
        if (!allowedRoles[userRole].includes(role)) {
            console.log('User does not have permission to create this role');
            return res.status(403).json({ message: "You do not have permission to create this role" });
        }

        if (role === 'chairperson') {
            const existingChairperson = await User.findOne({
                where: { role: 'chairperson', departmentId} 
            })
            if (existingChairperson) {
                return res.status(400).json({ message: `The department already has a Chairperson` });
            }
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
            departmentId,
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
        const { name, username, email, password, role, departmentName } = req.body;
        const { role: userRole } = req.user;

        // Check if the user has permission to update
        if (!allowedRoles[userRole].includes(role)) {
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

        let departmentId = user.departmentId;
        if(departmentName) {
            const department = await Department.findOne({ where: { name: departmentName}});
            if(department) {
                departmentId = department.id;
                console.log('Found department ID:', departmentId); 
            } else {

                return res.status(400).json({ message: 'Department not found'});
            }
        }

        // Update user details
       

        // const updateData = {
        //     name: name || user.name,
        //     username: username || user.username,
        //     email: email || user.email,
        //     role: role || user.role,
        //     departmentId
        // }
        user.name = name || user.name;
        user.username = username || user.username;
        user.email = email || user.email;
        user.role = role || user.role;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }
        // user.department = departmentId || user.departmentId;
        user.departmentId = departmentId

         // Perform the update
        //  console.log('Update data:', updateData);
         await user.save();
        // console.log('User after save:', updatedUser); // Debugging statement


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
        const { role: userRole, departmentId: requesterDeptId } = req.user;

        // Check if the user has permission to delete
        if (!allowedRoles[userRole].includes('admin')) {
            return res.status(403).json({ message: 'You do not have permission to delete users' });
        }

        // Find and delete the user
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure admins can only delete users within their own department
        if (userRole === 'admin' && user.departmentId !== requesterDeptId) {
            return res.status(403).json({ message: 'Admins can only delete users in their own department' });
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
        const { role: userRole, id: requesterId, departmentId: requesterDeptId   } = req.user;

        if (userRole === 'admin' || requesterId === parseInt(id, 10)) {
            // Find the user by ID
            const user = await User.findOne({ where: { id } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

             // Ensure that admins can only view users within their own department
             if (userRole === 'admin' && user.departmentId !== requesterDeptId) {
                return res.status(403).json({ message: 'Admins can only view users in their own department' });
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
        const { role: currentUserRole, departmentId: requesterDeptId } = req.user;

        // Debugging logs
        console.log('Current User Role:', currentUserRole);
        console.log('Requester Department ID:', requesterDeptId);


        if (!requesterDeptId) {
            console.error('Department ID is undefined. Cannot filter users by department.');
            return res.status(400).json({ message: 'Department ID is required to fetch users' });
        }

        // Define role-based permissions for viewing users
        const rolePermissions = {
            admin: ['admin', 'manager', 'dean', 'chairperson', 'researcher'],
            manager: ['manager', 'dean', 'chairperson', 'researcher'],
            dean: ['dean', 'chairperson', 'researcher'],
            chairperson: ['chairperson', 'researcher'],
            researcher: [] // Researchers cannot view other users
        };

        // Determine which roles can be viewed by the current user
        const allowedRoles = rolePermissions[currentUserRole] || [];

        // Fetch all users based on role permissions
        let users;
        if (currentUserRole === 'admin') {
            users = await User.findAll({
                // Admins can view users within their department
                include: [
                    { model: Publication, as: 'publications' },
                    { model: IntellectualProperty, as: 'intellectualProperties' }
                ]
            }); // Fetch all users
        } else if (allowedRoles.length > 0) {
            users = await User.findAll({
                where: {
                    role: allowedRoles,
                    departmentId: requesterDeptId,
                },
                include: [
                    {model: Publication, as: 'publications'},
                    {model: IntellectualProperty, as: 'intellectualProperties'}
                ]
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


const promoteOrDemoteUser = async (req, res) => {
    console.log('Received request to promote/demote user:', req.body);
    try {
        const { id } = req.params; // User ID to promote/demote
        const { newRole } = req.body; // New role to assign
        const { role: userRole, departmentId: requesterDeptId } = req.user;

        // Fetch the user to be promoted/demoted
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Determine if the current user has permission to promote/demote
        const roleHierarchy = {
            manager: ['dean', 'chairperson', 'researcher'],
            dean: ['dean','chairperson', 'researcher'],
            chairperson: ['researcher']
        };

        if (!roleHierarchy[userRole]?.includes(newRole)) {
            return res.status(403).json({ message: 'You do not have permission to assign this role' });
        }

        // Ensure that Chairpersons cannot promote themselves to Dean
        if (newRole === 'dean' && !['admin', 'manager'].includes(userRole)) {
            return res.status(403).json({ message: `Only Admins or Managers can promote to Dean` });
        }
       
        

        // Check department restrictions
        if (['admin', 'manager'].includes(userRole)) {
            // Admins and Managers can manage users in all departments
        } else {
            // Deans and Chairpersons can only manage users within their own department
            if (user.departmentId !== requesterDeptId) {
                return res.status(403).json({ message: 'You can only promote/demote users within your own department' });
            }
        }

        // Update the user's role
        user.role = newRole;
        await user.save();

        res.status(200).json({ message: `User promoted/demoted to ${newRole} successfully`, user });
    } catch (error) {
        console.error('Error promoting/demoting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getAllUsers,
    getUser,
    promoteOrDemoteUser // Add this to your exports
};

