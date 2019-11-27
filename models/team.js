'use strict';
module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('Team', {
    name: DataTypes.STRING,
    coach: DataTypes.STRING,
    capitan: DataTypes.STRING
  }, {});
  Team.associate = function(models) {
   Team.hasMany(models.Round, {as : 'rounds' })
  };
  return Team;
};