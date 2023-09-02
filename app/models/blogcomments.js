"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class blogcomments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Blogs, Blogreplies }) {
      // define association here
      this.belongsTo(Blogs, { foreignKey: "blogId", allowNull:false });
      this.hasMany(Blogreplies, { foreignKey: "commentId" });
    }
  }
  blogcomments.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      comment_fullname: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      comment_email: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      comment_content: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      tableName: "blogcomments",
      modelName: "Blogcomments",
    }
  );
  return blogcomments;
};
