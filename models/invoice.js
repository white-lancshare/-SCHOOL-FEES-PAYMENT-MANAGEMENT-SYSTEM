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
      Invoice.belongsTo(models.Student, {
        foreignKey: "studentId",
        as: "student",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });

      Invoice.belongsTo(models.FeeCategory, {
        foreignKey: "feeCategoryId",
        as: "feeCategory",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });

      Invoice.hasMany(models.Payment, {
      foreignKey: "invoiceId",
      as: "payments",
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    });

    }
  }
  Invoice.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      studentId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      feeCategoryId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dueDate: {
        allowNull: false,
        type: DataTypes.DATEONLY,
      },
      status: {
        type: DataTypes.ENUM("Unpaid", "Partially Paid", "Fully Paid"),
        allowNull: false,
        defaultValue: "Unpaid",
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
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