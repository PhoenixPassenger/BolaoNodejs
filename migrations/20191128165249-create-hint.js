'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Hints', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {  
          model: 'Users',
          key: 'id'
        }
      },
      rank: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      competitionName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      TeamId: {
        type: Sequelize.INTEGER,
        references: {  
          model: 'Teams',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Hints');
  }
};