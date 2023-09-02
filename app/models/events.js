"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class events extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  events.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      event_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      event_date: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      event_starttime: {
        allowNull: false,
        type: DataTypes.TIME,
      },
      event_location: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      event_poster: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      event_description: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      tableName: "events",
      modelName: "Events",
    }
  );
  return events;
};
