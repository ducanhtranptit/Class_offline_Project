"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			"Permissions",
			[
				{
					values: "users.read",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					values: "users.permission",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					values: "roles.read",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					values: "roles.add",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					values: "roles.update",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					values: "users.add",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					values: "users.update",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					values: "users.delete",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					values: "roles.delete",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					values: "courses.delete",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					values: "classes.read",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					values: "courses.read",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					values: "courses.update",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					values: "courses.add",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					values: "classes.add",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					values: "classes.update",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					values: "classes.delete",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					values: "teachers.read",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					values: "teachers.add",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					values: "teachers.update",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					values: "teachers.delete",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					values: "students.read",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					values: "students.add",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					values: "students.update",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					values: "students.delete",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("Permissions", null, {});
	},
};
