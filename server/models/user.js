'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Application, { foreignKey: 'UserId' });
      User.hasMany(models.Job, { as: 'PostedJobs', foreignKey: 'recruiterId' });
      User.hasMany(models.SavedJob, { foreignKey: 'UserId' });
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('applicant', 'recruiter'), defaultValue: 'applicant' }
  }, { sequelize, modelName: 'User' });
  return User;
};