"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class otps extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
   
  }
  otps.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      otp: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: "otps",
      modelName: "Otps",
    }
  );
  return otps;
};
