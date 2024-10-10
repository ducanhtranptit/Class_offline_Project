"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Exercises",
      [
        {
          classId: 1,
          title: 'Exercise 1',
          content: 'Create a simple HTML file',
          attachment: 'https://www.w3schools.com/html/default.asp',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          classId: 1,
          title: 'Exercise 2',
          content: 'Create a simple CSS file',
          attachment: 'https://www.w3schools.com/css/default.asp',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          classId: 2,
          title: 'Exercise 3',
          content: 'Create a simple JavaScript file',
          attachment: 'https://www.w3schools.com/js/default.asp',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          classId: 3,
          title: 'Exercise 4',
          content: 'Create a simple React component',
          attachment: 'https://reactjs.org/docs/getting-started.html',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          classId: 4,
          title: 'Exercise 5',
          content: 'Create a simple Node.js server',
          attachment: 'https://nodejs.org/en/docs/guides/getting-started-guide/',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          classId: 5,
          title: 'Exercise 6',
          content: 'Create a simple Express.js app',
          attachment: 'https://expressjs.com/en/starter/hello-world.html',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          classId: 4,
          title: 'Exercise 7',
          content: 'Create a simple MongoDB database',
          attachment: 'https://docs.mongodb.com/manual/tutorial/getting-started/',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          classId: 5,
          title: 'Exercise 8',
          content: 'Create a simple REST API',
          attachment: 'https://restfulapi.net/',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          classId: 6,
          title: 'Exercise 9',
          content: 'Create a simple GraphQL API',
          attachment: 'https://graphql.org/learn/',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          classId: 4,
          title: 'Exercise 10',
          content: 'Create a simple Vue.js app',
          attachment: 'https://vuejs.org/v2/guide/',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          classId: 5,
          title: 'Exercise 11',
          content: 'Create a simple Angular app',
          attachment: 'https://angular.io/start',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          classId: 6,
          title: 'Exercise 12',
          content: 'Create a simple Svelte app',
          attachment: 'https://svelte.dev/tutorial/basics',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Exercises", null, {});
  },
};
