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
const Course = model.Course;
const ModuleDocument = model.ModuleDocument;
const CourseModule = model.CourseModule;

const moduleName = "Khóa học";

module.exports = {
	index: async (req, res) => {
		try {
			const title = "Danh sách khóa học";
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
						"$User.name$": {
							[Op.like]: `%${keyword}%`,
						},
					},
				];
			}

			const totalCountObj = await Course.findAndCountAll({
				include: {
					model: User,
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

			const courses = await Course.findAll({
				include: {
					model: User,
				},
				where: filters,
				limit: +recordNumber,
				offset: offset,
			});

			const permissionUser = await permissionUtils.roleUser(req);

			res.render("admin/course/index", {
				req,
				title,
				moduleName,
				courses,
				recordNumber,
				page,
				totalPage,
				permissionUtils,
				permissionUser,
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
			const title = "Thêm khóa học";
			const userName = req.user.name;
			const errors = req.flash("errors");

			const teachers = await User.findAll({
				include: {
					model: Type,
					where: {
						name: "Teacher",
					},
				},
			});

			const permissionUser = await permissionUtils.roleUser(req);

			res.render("admin/course/add", {
				title,
				moduleName,
				errors,
				teachers,
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
			const {
				courseName,
				coursePrice,
				teacherId,
				tryLearn,
				courseQuantity,
				courseDuration,
			} = req.body;

			console.log("9999999");
			

			const result = validationResult(req);
			console.log('result: ', result);				
			if (result.isEmpty()) {
				await Course.create({
					name: courseName,
					price: coursePrice,
					teacherId: teacherId,
					tryLearn: tryLearn,
					quantity: courseQuantity,
					duration: courseDuration,
				});

				return res.redirect("/admin/courses");
			}

			req.flash("errors", result.errors);
			res.redirect("/admin/courses/add");
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	edit: async (req, res) => {
		try {
			const title = "Sửa khóa học";
			const userName = req.user.name;
			const { id } = req.params;
			const errors = req.flash("errors");

			const course = await Course.findOne({
				include: {
					model: User,
				},
				where: {
					id: id,
				},
			});
			const teacherName = course.User.name;

			const teachers = await User.findAll({
				include: {
					model: Type,
					where: {
						name: "Teacher",
					},
				},
			});

			const permissionUser = await permissionUtils.roleUser(req);

			res.render("admin/course/edit", {
				title,
				moduleName,
				course,
				teacherName,
				teachers,
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
			const {
				courseName,
				coursePrice,
				teacherId,
				tryLearn,
				courseQuantity,
				courseDuration,
			} = req.body;

			const result = validationResult(req);
			if (result.isEmpty()) {
				await Course.update(
					{
						name: courseName,
						price: coursePrice,
						teacherId: teacherId,
						tryLearn: tryLearn,
						quantity: courseQuantity,
						duration: courseDuration,
					},
					{
						where: {
							id: id,
						},
					}
				);
				return res.redirect(`/admin/courses/edit/${id}`);
			}

			req.flash("errors", result.errors);
			res.redirect(`/admin/courses/edit/${id}`);
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	destroy: async (req, res) => {
		try {
			const { id } = req.params;
			const course = await Course.findOne({
				where: {
					id: id,
				},
			});

			if (course) {
				await Course.destroy({
					where: {
						id: id,
					},
				});
			}
			res.redirect("/admin/courses");
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	destroyAll: async (req, res) => {
		try {
			const { listCourseDelete } = req.body;
			const listIdCourse = listCourseDelete.split(",");
			console.log(listIdCourse);
			await Course.destroy({
				where: {
					id: {
						[Op.in]: listIdCourse,
					},
				},
			});
			res.redirect("/admin/courses");
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	detail: async (req, res) => {
		try {
			const title = "Chi tiết khóa học";
			const userName = req.user.name;
			const { id } = req.params;
			let moduleArr = [];

			req.flash("courseId", id);
			const course = await Course.findOne({
				include: {
					model: User,
				},
				where: {
					id: id,
				},
			});
			const modules = await CourseModule.findAll({
				include: {
					model: Course,
					where: {
						id: id,
					},
				},
			});

			const moduleDocument = modules.map(async (moduleVal) => {
				const documentList = await ModuleDocument.findAll({
					where: {
						moduleId: moduleVal.id,
					},
				});
				return {
					id: moduleVal.dataValues.id,
					documentList,
				};
			});
			await Promise.all(moduleDocument).then((result) => {
				moduleArr = result;
			});

			const permissionUser = await permissionUtils.roleUser(req);

			res.render("admin/course/detail", {
				course,
				modules,
				moduleArr,
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

	export: async (req, res) => {
		try {
			const courses = await Course.findAll({
				include: {
					model: User,
				},
			});
			courses.forEach((course, index) => {
				courses[index].dataValues.teacherName = course.User.name;
			});
			const columns = constants.courseColumnFile;
			const date = new Date().getTime();
			const fileName = `course_${date}.xlsx`;
			exportFile(res, courses, "Course", fileName, columns);
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	import: async (req, res) => {
		try {
			const title = "Import File";
			const userName = req.user.name;

			const permissionUser = await permissionUtils.roleUser(req);

			res.render("admin/course/import", {
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

			for (let index = 0; index < data.length; index++) {
				const user = await User.findOne({
					where: {
						name: data[index].column_3,
					},
				});
				console.log("Dataaaa: ", data);
				await Course.create({
					name: data[index].column_1,
					price: data[index].column_2,
					teacherId: user.id,
					tryLearn: data[index].column_4,
					quantity: data[index].column_5,
					duration: data[index].column_6,
				});
			}
			res.redirect("/admin/courses");
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},
};
