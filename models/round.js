'use strict';
module.exports = (sequelize, DataTypes) => {
  const Round = sequelize.define('Round', {
    idTeam: DataTypes.INTEGER,
    rank: DataTypes.INTEGER,
    competitionName: DataTypes.STRING
  }, {});
  Round.associate = function(models) {
    Round.belongsTo(models.Team, {foreignKey: 'idTeam', as: 'team'})
  };
  return Round;
};