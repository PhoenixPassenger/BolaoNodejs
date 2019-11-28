'use strict';
module.exports = (sequelize, DataTypes) => {
  const Hint = sequelize.define('Hint', {
    UserId: DataTypes.INTEGER,
    rank: DataTypes.INTEGER,
    competitionName: DataTypes.STRING,
    TeamId: DataTypes.INTEGER
  }, {});
  Hint.associate = function(models) {
    Hint.belongsTo(models.Team, {foreignKey: 'TeamId', as: 'team'});
    Hint.belongsTo(models.User,{foreignKey: 'UserId',as : 'user'})
  };
  return Hint;
};