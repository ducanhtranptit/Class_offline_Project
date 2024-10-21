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
const { sequelize } = require('../../../models');
const User = model.User;
const TeacherCalendar = model.TeacherCalendar;
const Course = model.Course;
const Type = model.Type;

const moduleName = "Giảng viên";

module.exports = {
	index: async (req, res) => {
		try {
			const title = "Danh sách giảng viên, trợ giảng";
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
						name: {
							[Op.or]: ["Teacher", "TA"],
						},
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
			const teachers = await User.findAll({
				include: {
					model: Type,
					where: {
						name: {
							[Op.or]: ["Teacher", "TA"],
						},
					},
				},
				where: filters,
				attributes: [
					"id",
					"name",
					"email",
					"phone",
					"typeId",
					"address",
					"createdAt",
				],
				limit: +recordNumber,
				offset: offset,
			});

			const permissionUser = await permissionUtils.roleUser(req);

			res.render("admin/teacher/index", {
				req,
				teachers,
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
			const title = "Thêm giảng viên, trợ giảng";
			const userName = req.user.name;
			const errors = req.flash("errors");

			const permissionUser = await permissionUtils.roleUser(req);

			res.render("admin/teacher/add", {
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
				const { name, email, phone, address, typeName } = req.body;
				const type = await Type.findOne({
					where: {
						name: typeName,
					},
				});
				await User.create({
					name: name,
					email: email,
					phone: phone,
					address: address,
					typeId: type.id,
				});
				return res.redirect("/admin/teachers");
			}
			req.flash("errors", result.errors);
			res.redirect("/admin/teachers/add");
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	edit: async (req, res) => {
		try {
			const { id } = req.params;
			const userName = req.user.name;
			const title = "Sửa giảng viên, trợ giảng";
			const errors = req.flash("errors");

			const teacher = await User.findOne({
				include: {
					model: Type,
				},
				where: {
					id: id,
				},
			});

			const permissionUser = await permissionUtils.roleUser(req);

			res.render("admin/teacher/edit", {
				teacher,
				title,
				moduleName,
				errors,
				validate,
				permissionUtils,
				permissionUser,
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
			const { name, email, phone, address, typeName } = req.body;

			const result = validationResult(req);
			console.log(result);
			if (result.isEmpty()) {
				const type = await Type.findOne({
					where: {
						name: typeName,
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

				return res.redirect(`/admin/teachers/edit/${id}`);
			}

			console.log("Lỗi", result);

			req.flash("errors", result.errors);
			res.redirect(`/admin/teachers/edit/${id}`);
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	destroy: async (req, res) => {
		try {
			const { id } = req.params;
			console.log("teacherId:", id);

			const teacher = await User.findOne({
				where: {
					id: id,
				},
			});
			if (teacher) {
				await sequelize.query(
					`DELETE FROM Classes_Teachers WHERE teacherId = :teacherId`,
					{
						replacements: { teacherId: id },
						type: sequelize.QueryTypes.DELETE,
					}
				);
				await TeacherCalendar.destroy({
					where: { teacherId: id },
				});
				await Course.update(
					{ teacherId: null },
					{
						where: {
							teacherId: id,
						},
					}
				);

				await User.destroy({
					where: { id: id },
				});
			}
			res.redirect("/admin/teachers");
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	destroyAll: async (req, res) => {
		try {
			const { listTeacherDelete } = req.body;
			const listIdTeacher = listTeacherDelete.split(",");
			await TeacherCalendar.destroy({
				where: {
					teacherId: {
						[Op.in]: listIdStudent,
					},
				},
			});
			await Course.destroy({
				where: {
					teacherId: {
						[Op.in]: listIdStudent,
					},
				},
			});
			await User.destroy({
				where: {
					id: {
						[Op.in]: listIdTeacher,
					},
				},
			});
			res.redirect("/admin/teachers");
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	detail: async (req, res) => {
		try {
			const title = "Chi tiết giảng viên/trợ giảng";
			const userName = req.user.name;
			const { id } = req.params;

			const teacher = await User.findOne({
				include: {
					model: Type,
				},
				where: {
					id: id,
				},
			});
			const classes = await teacher.getClasses();

			const permissionUser = await permissionUtils.roleUser(req);

			res.render("admin/teacher/detail", {
				title,
				moduleName,
				teacher,
				classes,
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
			const teachers = await User.findAll({
				include: {
					model: Type,
					where: {
						name: {
							[Op.or]: ["Teacher", "TA"],
						},
					},
				},
			});
			teachers.forEach((teacher, index) => {
				if (teacher.Type.name === "Teacher") {
					teachers[index].dataValues.typeName = "Giảng viên";
				} else {
					teachers[index].dataValues.typeName = "Trợ giảng";
				}
			});
			const columns = constants.teacherColumnFile;
			const date = new Date().getTime();
			const fileName = `user_teacher_${date}.xlsx`;
			exportFile(res, teachers, "User_Teacher", fileName, columns);
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	import: async (req, res) => {
		try {
			const title = "Import File Teacher";
			const userName = req.user.name;

			const permissionUser = await permissionUtils.roleUser(req);

			res.render("admin/teacher/import", {
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
			console.log("Tên file", file);
			const data = await importFile(file.path);
			for (let index = 0; index < data.length; index++) {
				if (data[index].column_4 === "Giảng viên") {
					data[index].column_4 = "Teacher";
				} else {
					data[index].column_4 = "TA";
				}
				const type = await Type.findOne({
					where: {
						name: data[index].column_4,
					},
				});
				console.log(type);
				await User.create({
					name: data[index].column_1,
					email: data[index].column_2.text,
					phone: data[index].column_3,
					typeId: type.id,
					address: data[index].column_5,
				});
			}
			res.redirect("/admin/teachers");
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},
};
