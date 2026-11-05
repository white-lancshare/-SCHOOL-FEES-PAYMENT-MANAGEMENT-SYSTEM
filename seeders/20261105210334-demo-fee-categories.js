'use strict';

const { feeCategoryIds } = require("./seedId");
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

    await queryInterface.bulkInsert("FeeCategories", [
      {
        id: feeCategoryIds.tuition,
        name: "Tuition Fee",
        amount: 150000,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: feeCategoryIds.laboratory,
        name: "Laboratory Fee",
        amount: 25000,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: feeCategoryIds.library,
        name: "Library Fee",
        amount: 10000,
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

    await queryInterface.bulkDelete("FeeCategories", null, {});
  }
};
