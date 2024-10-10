"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "CourseModules",
      [
        {
          name: "Nhập môn lập trình",
          courseId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "HTML/CSS",
          courseId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Javascript",
          courseId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "ReactJS",
          courseId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "NodeJS",
          courseId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "MongoDB",
          courseId: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Python",
          courseId: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Machine Learning",
          courseId: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("CourseModules", null, {});
  },
};
