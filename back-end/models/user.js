'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

     static associate({ Post, Comment }) {
      this.hasMany(Post, { foreignKey: 'userId', as: 'user' })
      this.hasMany(Comment, { foreignKey: 'userId', as: 'userComment' })
    }
        
    toJSON() {
      return { ...this.get(), id: undefined }
    }

  }
  User.init({
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'User must have a name' },
        notEmpty: { msg: 'User must not be empty' },
        len: [3,10]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: ' must be a email adress' },
        notNull: { msg: 'User must have a email' },
        notEmpty: { msg: 'email must not be empty' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'http://localhost:5000/images/profils/defaultProfils.jpg'
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1,
      allowNull: false
    }
  },
    {
      sequelize,
      tableName: 'users',
      modelName: 'User',
    });
  return User;
};