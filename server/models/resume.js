'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Resume extends Model {
    static associate(models) {
      Resume.belongsTo(models.Application, { foreignKey: 'ApplicationId' });
    }
  }
  Resume.init({
    filename: DataTypes.STRING,
    path: DataTypes.STRING,
    ApplicationId: DataTypes.INTEGER
  }, { sequelize, modelName: 'Resume' });
  return Resume;
};