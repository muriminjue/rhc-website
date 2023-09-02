"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class blogcategories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Blogs }) {
      // define association here
      this.hasMany(Blogs, { foreignKey: "categoryId" });
    }
  }
  blogcategories.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      category_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      category_description: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      tableName: "blogcategories",
      modelName: "Blogcategories",
    }
  );
  return blogcategories;
};
