'use strict';

const uuid = require("uuid").v4;
const { invoiceIds } = require("./seedId");
const now = new Date();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert("Payments", [
      {
        id: uuid(),
        invoiceId: invoiceIds.danielTuition,
        amount: 50000,
        paymentDate: "2026-11-01",
        paymentMethod: "Transfer",
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(),
        invoiceId: invoiceIds.graceTuition,
        amount: 150000,
        paymentDate: "2026-11-02",
        paymentMethod: "Card",
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(),
        invoiceId: invoiceIds.estherLaboratory,
        amount: 10000,
        paymentDate: "2026-11-02",
        paymentMethod: "Cash",
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(),
        invoiceId: invoiceIds.adaLibrary,
        amount: 10000,
        paymentDate: "2026-11-03",
        paymentMethod: "POS",
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(),
        invoiceId: invoiceIds.graceLaboratory,
        amount: 15000,
        paymentDate: "2026-11-03",
        paymentMethod: "Transfer",
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(),
        invoiceId: invoiceIds.graceLaboratory,
        amount: 10000,
        paymentDate: "2026-11-04",
        paymentMethod: "Cash",
        createdAt: now,
        updatedAt: now
      }
    ]);
  
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("Payments", null, {});
  }
};
