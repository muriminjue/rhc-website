"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class blogreplies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Blogcomments }) {
      // define association here
      this.belongsTo(Blogcomments, { foreignKey: "commentId" });
    }
  }
  blogreplies.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      reply_fullname: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      reply_email: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      reply_content: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      tableName: "blogreplies",
      modelName: "Blogreplies",
    }
  );
  return blogreplies;
};
