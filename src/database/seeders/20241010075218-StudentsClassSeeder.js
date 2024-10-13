"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const studentsClasses = [];
		const totalClasses = 8;
		const totalStudents = 30;
		const minStudentsPerClass = 15;

		let classId = 1;

		// Loop to ensure each class has at least 15 students
		for (let studentId = 21; studentId < 21 + totalStudents; studentId++) {
			// Each student can enroll in multiple classes
			for (let i = 0; i < 5; i++) {
				// Allow each student to enroll in 5 different classes
				studentsClasses.push({
					studentId,
					classId,
					statusId: studentId % 2 === 0 ? 1 : 2, // Alternating status
					completeDate: null,
					dropDate: null,
					recover: null,
					createdAt: new Date(),
					updatedAt: new Date(),
				});

				// Move to the next class
				classId = classId < totalClasses ? classId + 1 : 1;
			}
		}

		await queryInterface.bulkInsert("StudentsClasses", studentsClasses, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("StudentsClasses", null, {});
	},
};
