"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "ModuleDocuments",
      [
        {
          content: "Nhập môn lập trình web 2",
          pathName:
            "https://docs.google.com/presentation/d/1EfrKYnOB_XWKvceNa4zW2xLsyZ2H58yM/edit#slide=id.p1",
          moduleId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          content: "HTML/CSS",
          pathName:
            "https://docs.google.com/presentation/d/1EfrKYnOB_XWKvceNa4zW2xLsyZ2H58yM/edit#slide=id.p2",
          moduleId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          content: "JavaScript",
          pathName:
            "https://docs.google.com/presentation/d/1EfrKYnOB_XWKvceNa4zW2xLsyZ2H58yM/edit#slide=id.p3",
          moduleId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          content: "React",
          pathName:
            "https://docs.google.com/presentation/d/1EfrKYnOB_XWKvceNa4zW2xLsyZ2H58yM/edit#slide=id.p4",
          moduleId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          content: "Node.js",
          pathName:
            "https://docs.google.com/presentation/d/1EfrKYnOB_XWKvceNa4zW2xLsyZ2H58yM/edit#slide=id.p5",
          moduleId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          content: "MongoDB",
          pathName:
            "https://docs.google.com/presentation/d/1EfrKYnOB_XWKvceNa4zW2xLsyZ2H58yM/edit#slide=id.p6",
          moduleId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ModuleDocuments", null, {});
  },
};
