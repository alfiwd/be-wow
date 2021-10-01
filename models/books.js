'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class books extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  books.init({
    name: DataTypes.STRING,
    author: DataTypes.STRING,
    publication_date: DataTypes.STRING,
    pages: DataTypes.INTEGER,
    isbn: DataTypes.INTEGER,
    file_book: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'books',
  });
  return books;
};