'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FeeCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
FeeCategory.hasMany(models.Invoice,{
  foreignKey:"id",
  onUpdate:"CASCADE",
  onDelete:"CASCADE"
})


    }
  }
  FeeCategory.init(
     {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4
      },name:{
   type:DataTypes.STRING,
   allowNull:false
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull:false
      },dueDate:{
      type: DataTypes.DATEONLY,
      allowNull:false
      },status:{
         type: DataTypes.ENUM('Unpaid','Partially Paid','Fully Paid'),
        allowNull:false,
        defaultValue:"Unpaid"
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
      modelName: "FeeCategory",
      tableName: "FeeCategories",
      timestamps: true,
    },
  );
  return FeeCategory;
};