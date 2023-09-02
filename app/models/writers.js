"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class writers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Blogs}) {
      // define association here
     this.hasMany(Blogs, { foreignKey: "writerId" });
    }
  }
  writers.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      writer_fullname: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      writer_email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique:true,
      },
      writer_image: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      writer_description: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      tableName: "writers",
      modelName: "Writers",
    }
  );
  return writers;
};
