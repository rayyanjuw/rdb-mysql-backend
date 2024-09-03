const { DataTypes } = require('sequelize');
const sequelize = require('../config/mysqlConnection'); // Correct import
const User = require('./userModels');
const Department = require('./departmentmodel');

const Publication = sequelize.define('Publication', {
  articletype: { type: DataTypes.STRING },
  titleofmanuscript: { type: DataTypes.STRING },
  journal: { type: DataTypes.STRING },
  ISSN: { type: DataTypes.STRING },
  Volume: { type: DataTypes.STRING },
  Issue: { type: DataTypes.STRING },
  Year: { type: DataTypes.INTEGER },
  DateofPublication: { type: DataTypes.DATE },
  Pages: { type: DataTypes.STRING },
  HECcategory: { type: DataTypes.STRING },
  webofScience: { type: DataTypes.BOOLEAN },
  impactfactor: { type: DataTypes.FLOAT },
  scopus: { type: DataTypes.BOOLEAN },
  urlOfPublication: { type: DataTypes.STRING },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: User, // Name of the referenced model
        key: 'id' // Key in the referenced model
    }
},
targetRole: {
  type: DataTypes.STRING, // Adjust the type if needed
  allowNull: false,
},
departmentId: {
  type: DataTypes.INTEGER,
  references: {
    model: Department,
    key: 'id'
  }
}
  // supervisedBy: {
  //   type: DataTypes.INTEGER,
  //   references: { model: User, key: 'id' }
  // },
  // deptHead: {
  //   type: DataTypes.INTEGER,
  //   references: { model: User, key: 'id' }
  // },
  // researcher: {
  //   type: DataTypes.INTEGER,
  //   references: { model: User, key: 'id' }
  // },
  // managedBy: { // Add this line
  //   type: DataTypes.INTEGER,
  //   references: { model: User, key: 'id' }
  // }
}, {
  tableName: 'publications', // Ensure the table name is correct
  timestamps: true,
});


module.exports = Publication;
