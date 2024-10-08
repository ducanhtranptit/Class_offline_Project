"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			"Roles",
			[
				{
					name: "Super Admin",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: "Admin",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: "Giáo vụ",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: "Chăm sóc khách hàng",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("Roles", null, {});
	},
};
