"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "ScheduleClasses",
      [
        {
          schedule: 2,
          timeLearn: "15:00 - 18:00",
          classId: 1,
          createdAt: new Date("2024-02-01 13:17:35"),
          updatedAt: new Date("2024-02-01 13:17:35"),
        },
        {
          schedule: 4,
          timeLearn: "03:00 - 06:00",
          classId: 2,
          createdAt: new Date("2024-02-01 14:45:20"),
          updatedAt: new Date("2024-02-01 14:45:20"),
        },
        {
          schedule: 1,
          timeLearn: "08:00 - 11:00",
          classId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          schedule: 3,
          timeLearn: "12:00 - 15:00",
          classId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          schedule: 2,
          timeLearn: "16:00 - 19:00",
          classId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          schedule: 4,
          timeLearn: "20:00 - 23:00",
          classId: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          schedule: 1,
          timeLearn: "07:00 - 10:00",
          classId: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          schedule: 3,
          timeLearn: "11:00 - 14:00",
          classId: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ScheduleClasses", null, {});
  },
};
