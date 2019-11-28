'use strict';
module.exports = (sequelize, DataTypes) => {
  const Round = sequelize.define('Round', {
    TeamId: DataTypes.INTEGER,
    rank: DataTypes.INTEGER,
    competitionName: DataTypes.STRING
  }, {});
  Round.associate = function(models) {
    Round.belongsTo(models.Team, {foreignKey: 'TeamId', as: 'team'})
  };
  return Round;
};