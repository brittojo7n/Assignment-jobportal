'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    static associate(models) {
      Job.belongsTo(models.User, { as: 'Recruiter', foreignKey: 'recruiterId' });
      Job.hasMany(models.Application, { foreignKey: 'JobId', onDelete: 'CASCADE' });
      Job.hasMany(models.SavedJob, { foreignKey: 'JobId', onDelete: 'CASCADE' });
    }
  }
  Job.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    location: DataTypes.STRING,
    company: DataTypes.STRING,
    recruiterId: DataTypes.INTEGER
  }, { sequelize, modelName: 'Job' });
  return Job;
};