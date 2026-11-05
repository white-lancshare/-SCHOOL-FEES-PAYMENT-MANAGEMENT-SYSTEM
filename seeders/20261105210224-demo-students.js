'use strict';

const { studentIds } = require("./seedId");
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

      await queryInterface.bulkInsert("Students", [
        {
          id: studentIds.daniel,
          firstName: "Daniel",
          lastName: "Mensah",
          phoneNumber: "09089666566",
          email: "daniel.mensah@gmail.com",
          createdAt: now,
          updatedAt: now,
        },
        {
          id: studentIds.ada,
          firstName: "Ada",
          lastName: "Okafor",
          phoneNumber: "08030000001",
          email: "ada.okafor@example.com",
          createdAt: now,
          updatedAt: now,
        },
        {
          id: studentIds.grace,
          firstName: "Grace",
          lastName: "Eze",
          phoneNumber: "08030000002",
          email: "grace.eze@gmail.com",
          createdAt: now,
          updatedAt: now,
        },
        {
          id: studentIds.samuel,
          firstName: "Samuel",
          lastName: "Bello",
          phoneNumber: "08030000003",
          email: "samuel.bello@gmail.com",
          createdAt: now,
          updatedAt: now,
        },
        {
          id: studentIds.esther,
          firstName: "Esther",
          lastName: "Adeyemi",
          phoneNumber: "08030000004",
          email: "joan.adeyemi@gmail.com",
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

    await queryInterface.bulkDelete("Students", null, {});
  }
};
