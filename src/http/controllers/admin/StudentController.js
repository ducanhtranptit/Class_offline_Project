const moment = require("moment");
const { Op } = require("sequelize");
const { validationResult } = require("express-validator");

const constants = require("../../../constants/index");
const exportFile = require("../../../utils/exportFile");
const importFile = require("../../../utils/importFile");
const { getPaginateUrl } = require("../../../utils/url");
const validate = require("../../../utils/validate");
const permissionUtils = require("../../../utils/permissionUtils");

const model = require("../../../models/index");
const User = model.User;
const Type = model.Type;
const StudentsClass = model.StudentsClass;
const Class = model.Class;
const Course = model.Course;
const StudentsAttendance = model.StudentsAttendance;
const ExercisesSubmit = model.ExercisesSubmit;
const Comment = model.Comment;

const moduleName = "Học viên";

module.exports = {
	index: async (req, res) => {
		try {
			const title = "Danh sách học viên";
			const userName = req.user.name;
			const filters = {};

			let { keyword, page, recordNumber } = req.query;
			if (!recordNumber) {
				recordNumber = 5;
			}

			if (keyword) {
				filters[Op.or] = [
					{
						name: {
							[Op.like]: `%${keyword}%`,
						},
					},
					{
						email: {
							[Op.like]: `%${keyword}%`,
						},
					},
				];
			}

			const totalCountObj = await User.findAndCountAll({
				include: {
					model: Type,
					where: {
						name: "Student",
					},
				},
				where: filters,
			});

			const totalCount = totalCountObj.count;
			const totalPage = Math.ceil(totalCount / recordNumber);

			if (!page || page < 1) {
				page = 1;
			}
			if (page > totalPage && page > 1) {
				page = totalPage;
			}

			const offset = (page - 1) * recordNumber;
			const students = await User.findAll({
				include: {
					model: Type,
					where: {
						name: "Student",
					},
				},
				where: filters,
				attributes: [
					"id",
					"name",
					"email",
					"phone",
					"address",
					"createdAt",
				],
				limit: +recordNumber,
				offset: offset,
			});

			const permissionUser = await permissionUtils.roleUser(req);

			res.render("admin/student/index", {
				req,
				students,
				moment,
				title,
				moduleName,
				totalPage,
				page,
				recordNumber,
				permissionUser,
				permissionUtils,
				getPaginateUrl,
				userName,
			});
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	add: async (req, res) => {
		try {
			const title = "Thêm học viên";
			const userName = req.user.name;
			const errors = req.flash("errors");

			const permissionUser = await permissionUtils.roleUser(req);

			res.render("admin/student/add", {
				title,
				moduleName,
				errors,
				validate,
				permissionUser,
				permissionUtils,
				userName,
			});
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	store: async (req, res) => {
		try {
			const result = validationResult(req);
			if (result.isEmpty()) {
				const { name, email, phone, address } = req.body;
				const type = await Type.findOne({
					where: {
						name: "Student",
					},
				});
				await User.create({
					name: name,
					email: email,
					phone: phone,
					address: address,
					typeId: type.id,
				});
				return res.redirect("/admin/students");
			}
			req.flash("errors", result.errors);
			res.redirect("/admin/students/add");
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	edit: async (req, res) => {
		try {
			const { id } = req.params;
			const userName = req.user.name;
			const title = "Sửa học viên";
			const errors = req.flash("errors");

			const student = await User.findOne({
				where: {
					id: id,
				},
			});

			const permissionUser = await permissionUtils.roleUser(req);

			res.render("admin/student/edit", {
				student,
				title,
				moduleName,
				errors,
				validate,
				permissionUser,
				permissionUtils,
				userName,
			});
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	update: async (req, res) => {
		try {
			const { id } = req.params;
			const { name, email, phone, address } = req.body;

			const result = validationResult(req);
			if (result.isEmpty()) {
				const type = await Type.findOne({
					where: {
						name: "Student",
					},
				});
				await User.update(
					{
						name: name,
						email: email,
						phone: phone,
						address: address,
						typeId: type.id,
					},
					{
						where: {
							id: id,
						},
					}
				);
				return res.redirect(`/admin/students/edit/${id}`);
			}

			req.flash("errors", result.errors);
			res.redirect(`/admin/students/edit/${id}`);
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	destroy: async (req, res) => {
		try {
			const { id } = req.params;
			const student = await User.findOne({
				where: {
					id: id,
				},
			});
			if (student) {
				await StudentsClass.destroy({
					where: { studentId: id },
				});
				await StudentsAttendance.destroy({
					where: { studentId: id },
				});
				await ExercisesSubmit.destroy({
					where: { studentId: id },
				});
				await Comment.destroy({
					where: { studentId: id },
				});
				await User.destroy({
					where: { id: id },
				});
			}
			res.redirect("/admin/students");
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	destroyAll: async (req, res) => {
		try {
			const { listStudentDelete } = req.body;
			const listIdStudent = listStudentDelete.split(",");
			await StudentsClass.destroy({
				where: {
					studentId: {
						[Op.in]: listIdStudent,
					},
				},
			});
			await StudentsAttendance.destroy({
				where: {
					studentId: {
						[Op.in]: listIdStudent,
					},
				},
			});
			await ExercisesSubmit.destroy({
				where: {
					studentId: {
						[Op.in]: listIdStudent,
					},
				},
			});
			await Comment.destroy({
				where: {
					studentId: {
						[Op.in]: listIdStudent,
					},
				},
			});
			await User.destroy({
				where: {
					id: {
						[Op.in]: listIdStudent,
					},
				},
			});
			res.redirect("/admin/students");
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	detail: async (req, res) => {
		try {
			const title = "Chi tiết học viên";
			const userName = req.user.name;
			const { id } = req.params;

			const student = await User.findOne({
				where: {
					id: id,
				},
			});

			const classStudent = await StudentsClass.findAll({
				where: {
					studentId: id,
				},
			});

			let classList = await Promise.all(
				classStudent.map(async (studentClassVal) => {
					return await Class.findOne({
						include: {
							model: Course,
						},
						where: {
							id: studentClassVal.classId,
						},
					});
				})
			);

			const permissionUser = await permissionUtils.roleUser(req);

			res.render("admin/student/detail", {
				title,
				moduleName,
				student,
				classList,
				permissionUser,
				permissionUtils,
				userName,
			});
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	export: async (req, res) => {
		try {
			const students = await User.findAll({
				include: {
					model: Type,
					where: {
						name: "Student",
					},
				},
			});
			const columns = constants.studentColumnFile;
			const date = new Date().getTime();
			const fileName = `User_Student_${date}.xlsx`;
			exportFile(res, students, "User_Student", fileName, columns);
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	import: async (req, res) => {
		try {
			const title = "Import File Student";
			const userName = req.user.name;

			const permissionUser = await permissionUtils.roleUser(req);

			res.render("admin/student/import", {
				title,
				moduleName,
				permissionUser,
				permissionUtils,
				userName,
			});
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	handleImport: async (req, res) => {
		try {
			const file = req.file;
			const data = await importFile(file.path);
			const type = await Type.findOne({
				where: {
					name: "Student",
				},
			});
			for (let index = 0; index < data.length; index++) {
				await User.create({
					name: data[index].column_1,
					email: data[index].column_2.text,
					phone: data[index].column_3,
					address: data[index].column_4,
					typeId: type.id,
				});
			}
			res.redirect("/admin/students");
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},
};
