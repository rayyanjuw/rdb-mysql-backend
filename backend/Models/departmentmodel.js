const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysqlConnection");

const Department = sequelize.define('Department', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
}, {
    tableName: 'departments',
    timestamps: true, // Enables createdAt and updatedAt fields
});

module.exports = Department;