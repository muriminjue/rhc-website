"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
      // this.hasMany(Blogs, { foreignKey: "writerId" });
    }
  }
  users.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_fullname: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      user_email: {
        allowNull: false,
        unique:true,
        type: DataTypes.STRING,
      },
      user_password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: "users",
      modelName: "Users",
    }
  );
  return users;
};
