"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class blogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Blogcomments, Blogcategories, Writers }) {
      // define association here
      this.belongsTo(Writers, { foreignKey: "writerId", allowNull: false });
      this.belongsTo(Blogcategories, { foreignKey: "categoryId" });
      this.hasMany(Blogcomments, { foreignKey: "blogId" });
    }
  }
  blogs.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      blog_slug: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
      blog_title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      blog_content: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      blog_image: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      blog_description: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      tableName: "blogs",
      modelName: "Blogs",
    }
  );
  return blogs;
};
