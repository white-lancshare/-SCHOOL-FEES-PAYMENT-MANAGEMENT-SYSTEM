'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Invoice.init(
    {
      studentId: DataTypes.UUID,
      feeCategoryId: DataTypes.UUID,
      amount: DataTypes.INTEGER,
      dueDate: DataTypes.DATE,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Invoice",
      tableName: "Invoices",
      timestamps: true,
    },
  );
  return Invoice;
};