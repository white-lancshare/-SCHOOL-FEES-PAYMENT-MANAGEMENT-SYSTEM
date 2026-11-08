'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Invoices', {
      id: {
        allowNull: false,

        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      invoiceName:{
  type:Sequelize.STRING,
  allowNull:false
      } ,     
      studentId: {
        type: Sequelize.UUID,
    references:{
       model:'students',
       key:'id'
    },
    onupdate:"CASCADE",
    ondelete:"CASCADE"
      },
      feeCategoryId: {
      type: Sequelize.UUID,
         references:{
       model:'FeeCategories',
       key:'id'
    },
    onupdate:"CASCADE",
    ondelete:"CASCADE"
      },
      amount: {
        type: Sequelize.STRING
      },
      dueDate: {
        type: Sequelize.STRING
      },
      status: {
       type: Sequelize.ENUM('Partially Paid','Fully Paid','Unpaid'),
        defaultValue: "Unpaid"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Invoices');
  }
};