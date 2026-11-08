'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Payments", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      invoiceId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "Invoices",
          key: "id"
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
      },
      amount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      paymentDate: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      paymentMethod: {
        allowNull: false,
        type: Sequelize.ENUM('POS', 'Cash', 'Transfer', 'Card'),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Payments');
  }
};