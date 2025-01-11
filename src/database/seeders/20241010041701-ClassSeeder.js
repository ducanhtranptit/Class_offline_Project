"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			"Classes",
			[
				{
					name: "Kỹ thuật siêu cao tần - D20",
					quantity: 29,
					startDate: "2025-02-01 07:00:00",
					endDate: "2025-08-22 07:00:00",
					courseId: 1,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: "Điện toán đám mây - D20",
					quantity: 48,
					startDate: "2025-02-01 07:00:00",
					endDate: "2025-08-22 07:00:00",
					courseId: 2,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: "Lập trình hướng đối tượng - D20",
					quantity: 30,
					startDate: "2025-02-01 07:00:00",
					endDate: "2025-08-22 07:00:00",
					courseId: 3,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: "Kỹ thuật lập trình - D20",
					quantity: 35,
					startDate: "2025-02-01 07:00:00",
					endDate: "2025-08-22 07:00:00",
					courseId: 4,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: "Kiến trúc máy tính - D20",
					quantity: 40,
					startDate: "2025-02-01 07:00:00",
					endDate: "2025-08-22 07:00:00",
					courseId: 5,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: "Tín hiệu và Hệ thống - D20",
					quantity: 45,
					startDate: "2025-02-01 07:00:00",
					endDate: "2025-08-22 07:00:00",
					courseId: 6,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: "Linh kiện và mạch điện tử - D20",
					quantity: 50,
					startDate: "2025-02-01 07:00:00",
					endDate: "2025-08-22 07:00:00",
					courseId: 7,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: "Lý thuyết truyền tin - D20",
					quantity: 55,
					startDate: "2025-02-01 07:00:00",
					endDate: "2025-08-22 07:00:00",
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
