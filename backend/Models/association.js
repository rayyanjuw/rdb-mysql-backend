// models/associations.js

const User = require('./userModels');
const Publication = require('./Publication');

// Define associations
User.hasMany(Publication, { foreignKey: 'userId', as: 'publications' });
Publication.belongsTo(User, { foreignKey: 'userId', as: 'creator' });

// Add other associations as needed

module.exports = { User, Publication };
