// models/userModels.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/mysqlConnection'); // Import the sequelize instance

const bcrypt = require('bcrypt');
const Department = require('./departmentmodel');

// Define the User model
const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        unique: 'compositeIndex',
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'compositeIndex'
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'manager', 'dean', 'chairperson', 'researcher'),
        allowNull: false
    },
    departmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Department,
            key: 'id'
        }
    }
    // department: {
    //     type: DataTypes.STRING,
    // }
}, {
    tableName: 'users',
    timestamps: true, // Enables createdAt and updatedAt fields
});




User.beforeCreate(async (user) => {
    if( user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
})

// Method to check Password
User.prototype.comparedPassword = async function (password) {
    return bcrypt.compare(password, this.password);
}




module.exports = User;
