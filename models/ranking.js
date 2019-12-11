'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ranking = sequelize.define('Ranking', {
    UserId: DataTypes.INTEGER,
    competitionName: DataTypes.STRING,
    score: DataTypes.FLOAT,
    hits: DataTypes.INTEGER
  }, {});
  Ranking.associate = function(models) {
    Ranking.belongsTo(models.User,{foreignKey: 'UserId',as : 'user'});

  };
  return Ranking;
};