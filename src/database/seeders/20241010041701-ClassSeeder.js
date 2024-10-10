"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Classes",
      [
        {
          name: "Fullstack K1",
          quantity: 29,
          startDate: "2024-02-01 07:00:00",
          endDate: "2024-08-22 07:00:00",
          courseId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Fullstack K2",
          quantity: 48,
          startDate: "2024-02-01 07:00:00",
          endDate: "2024-08-22 07:00:00",
          courseId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Frontend K1",
          quantity: 30,
          startDate: "2024-02-01 07:00:00",
          endDate: "2024-08-22 07:00:00",
          courseId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Backend K1",
          quantity: 35,
          startDate: "2024-02-01 07:00:00",
          endDate: "2024-08-22 07:00:00",

          courseId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Data Science K1",
          quantity: 40,
          startDate: "2024-02-01 07:00:00",
          endDate: "2024-08-22 07:00:00",
          courseId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Machine Learning K1",
          quantity: 45,
          startDate: "2024-02-01 07:00:00",
          endDate: "2024-08-22 07:00:00",
          courseId: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Fullstack K3",
          quantity: 50,
          startDate: "2024-02-01 07:00:00",
          endDate: "2024-08-22 07:00:00",
          courseId: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Frontend K2",
          quantity: 55,
          startDate: "2024-02-01 07:00:00",
          endDate: "2024-08-22 07:00:00",
          courseId: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Classes", null, {});
  },
};
