'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SavedJob extends Model {
    static associate(models) {
      SavedJob.belongsTo(models.User, { foreignKey: 'UserId' });
      SavedJob.belongsTo(models.Job, { foreignKey: 'JobId' });
    }
  }
  SavedJob.init({
    UserId: DataTypes.INTEGER,
    JobId: DataTypes.INTEGER
  }, { sequelize, modelName: 'SavedJob' });
  return SavedJob;
};