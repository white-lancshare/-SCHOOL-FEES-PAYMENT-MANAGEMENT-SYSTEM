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
Invoice.belongsTo(models.Student,{
  foreignkey:'id',
  onupdate:'CASCADE',
  ondelete:'CASCADE'
})

Invoice.belongsTo(models.FeeCategory,{
  foreignkey:'id',
  onupdate:'CASCADE',
  ondelete:'CASCADE'
})

    }
  }
  Invoice.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      }, 
      studentId: {
        type: DataTypes.UUID,
         allowNull: false,
      references:{
       model:'students',
       key:'id'
    },
    onUpdate:"CASCADE",
    onDelete:"CASCADE"
      },
      feeCategoryId: {
        type: DataTypes.UUID,
         allowNull: false,
         references:{
       model:'FeeCategories',
       key:'id'
    },
    onUpdate:"CASCADE",
    onDelete:"CASCADE"
      },
      amount: {
        type: DataTypes.INTEGER,
         allowNull: false
      },
      dueDate: {
         allowNull: false,
        type: DataTypes.DATEONLY
      },
      status: {
        type: DataTypes.ENUM('Partially Paid','Fully Paid','Unpaid'),
        defaultValue: "Unpaid",
         allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
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