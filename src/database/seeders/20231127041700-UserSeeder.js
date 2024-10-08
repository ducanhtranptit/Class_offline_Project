"use strict";

const model = require("../../models/index");
const Type = model.Type;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const typeAdmin = await Type.findOne({
			where: {
				name: "Admin",
			},
		});

		await queryInterface.bulkInsert(
			"Users",
			[
				{
					name: "Trần Đức Anh",
					email: "tda.ducanh@gmail.com",
					password:
						"$2a$12$zawaIZbPaxXwxf65FWH3CubNBFwnYUwSf7jaaCR5HuarHhqYMMD3a",
					phone: "0972414260",
					address: "Hà Nội",
					typeId: 1,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("Users", null, {});
	},
};
