"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class sermons extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  sermons.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      sermon_title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      sermon_date: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      sermon_speaker: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      sermon_location: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      sermon_videolink: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      sermon_poster: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      sermon_audio: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      sermon_description: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      tableName: "sermons",
      modelName: "Sermons",
    }
  );
  return sermons;
};
