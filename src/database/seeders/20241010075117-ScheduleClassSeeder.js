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
          schedule: 2,
          timeLearn: "21:00 - 00:00",
          classId: 2,
          createdAt: new Date("2024-02-01 14:45:20"),
          updatedAt: new Date("2024-02-01 14:45:20"),
        },
        {
          schedule: 4,
          timeLearn: "03:00 - 06:00",
          classId: 2,
          createdAt: new Date("2024-02-01 14:45:20"),
          updatedAt: new Date("2024-02-01 14:45:20"),
        },
        // Add 17 more dummy records here
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
        {
          schedule: 2,
          timeLearn: "15:00 - 18:00",
          classId: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          schedule: 4,
          timeLearn: "19:00 - 22:00",
          classId: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          schedule: 1,
          timeLearn: "06:00 - 09:00",
          classId: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          schedule: 3,
          timeLearn: "10:00 - 13:00",
          classId: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          schedule: 2,
          timeLearn: "14:00 - 17:00",
          classId: 13,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          schedule: 4,
          timeLearn: "18:00 - 21:00",
          classId: 14,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          schedule: 1,
          timeLearn: "05:00 - 08:00",
          classId: 15,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          schedule: 3,
          timeLearn: "09:00 - 12:00",
          classId: 16,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          schedule: 2,
          timeLearn: "13:00 - 16:00",
          classId: 17,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          schedule: 4,
          timeLearn: "17:00 - 20:00",
          classId: 18,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          schedule: 1,
          timeLearn: "21:00 - 00:00",
          classId: 19,
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
