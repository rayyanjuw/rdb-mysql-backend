'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('publications', 'targetRole', {
        type: Sequelize.STRING,
        allowNull: false,
    });
},

down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('publications', 'targetRole');
}
};
