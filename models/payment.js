"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment.belongsTo(models.Invoice, {
        foreignKey: "invoiceId",
        as: "invoice",
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      });
    }
  }
  Payment.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      invoiceId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: "Invoices",
          key: "id",
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
      amount: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      paymentDate: {
        allowNull: false,
        type: DataTypes.DATEONLY,
      },
      paymentMethod: {
        allowNull: false,
        type: DataTypes.ENUM("POS", "Cash", "Transfer", "Card"),
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
      modelName: "Payment",
      tableName: "Payments",
      timestamps: true,
    },
  );
  return Payment;
};
