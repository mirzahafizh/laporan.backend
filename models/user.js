'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here, if necessary
    }
  }
  
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Email must be unique
      validate: {
        isEmail: true, // Validate that the input is a valid email format
      },
    },
    role: {
      type: DataTypes.ENUM('admin', 'super admin', 'user'),
      allowNull: false,
      defaultValue: 'user', // Default role is 'user'
    },
    foto: {
      type: DataTypes.STRING, // This can be a URL or file path for the image
      allowNull: true, // Foto can be null
    },
  }, {
    sequelize,
    tableName: 'user', // Specify the table name explicitly
    modelName: 'User',   // This is the name of the model
  });
  
  return User;
};
