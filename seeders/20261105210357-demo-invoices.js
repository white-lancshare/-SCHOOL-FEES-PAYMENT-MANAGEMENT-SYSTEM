'use strict';

const { studentIds, feeCategoryIds, invoiceIds } = require("./seedId");
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

    await queryInterface.bulkInsert("Invoices", [
      {
        id: invoiceIds.adaTuition,
        studentId: studentIds.ada,
        feeCategoryId: feeCategoryIds.tuition,
        amount: 150000,
        dueDate: "2026-12-01",
        status: "Unpaid",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: invoiceIds.danielTuition,
        studentId: studentIds.daniel,
        feeCategoryId: feeCategoryIds.tuition,
        amount: 150000,
        dueDate: "2026-12-01",
        status: "Partially Paid",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: invoiceIds.graceTuition,
        studentId: studentIds.grace,
        feeCategoryId: feeCategoryIds.tuition,
        amount: 150000,
        dueDate: "2026-12-01",
        status: "Fully Paid",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: invoiceIds.samuelLaboratory,
        studentId: studentIds.samuel,
        feeCategoryId: feeCategoryIds.laboratory,
        amount: 25000,
        dueDate: "2026-12-01",
        status: "Unpaid",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: invoiceIds.estherLaboratory,
        studentId: studentIds.esther,
        feeCategoryId: feeCategoryIds.laboratory,
        amount: 25000,
        dueDate: "2026-12-01",
        status: "Partially Paid",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: invoiceIds.adaLibrary,
        studentId: studentIds.ada,
        feeCategoryId: feeCategoryIds.library,
        amount: 10000,
        dueDate: "2026-12-01",
        status: "Fully Paid",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: invoiceIds.danielLibrary,
        studentId: studentIds.daniel,
        feeCategoryId: feeCategoryIds.library,
        amount: 10000,
        dueDate: "2026-12-01",
        status: "Unpaid",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: invoiceIds.graceLaboratory,
        studentId: studentIds.grace,
        feeCategoryId: feeCategoryIds.laboratory,
        amount: 25000,
        dueDate: "2026-12-01",
        status: "Fully Paid",
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("Invoices", null, {});
  }
};
