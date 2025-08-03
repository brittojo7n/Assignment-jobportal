'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Application extends Model {
    static associate(models) {
      Application.belongsTo(models.User, { foreignKey: 'UserId' });
      Application.belongsTo(models.Job, { foreignKey: 'JobId' });
      Application.hasOne(models.Resume, { foreignKey: 'ApplicationId', onDelete: 'CASCADE' });
    }
  }
  Application.init({
    status: { type: DataTypes.ENUM('pending', 'shortlisted', 'rejected'), defaultValue: 'pending' },
    UserId: DataTypes.INTEGER,
    JobId: DataTypes.INTEGER
  }, { sequelize, modelName: 'Application' });
  return Application;
};