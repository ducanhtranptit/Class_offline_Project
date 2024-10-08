const permissionUtils = require("../../../utils/permissionUtils");

const model = require("../../../models/index");
const Course = model.Course;
const CourseModule = model.CourseModule;
const ModuleDocument = model.ModuleDocument;

const moduleName = "Tài Liệu";

module.exports = {
	add: async (req, res) => {
		try {
			const title = "Thêm tài liệu";
			const userName = req.user.name;
			const courseId = req.flash("courseId").slice(-1);

			const courses = await Course.findAll();
			const permissionUser = await permissionUtils.roleUser(req);

			res.render("admin/courseModule/add", {
				title,
				moduleName,
				courseId,
				courses,
				permissionUser,
				permissionUtils,
				userName,
			});
		} catch (error) {
			console.log(error.message);
			res.render("/error/500");
		}
	},

	store: async (req, res) => {
		try {
			const { moduleName, courseId } = req.body;
			await CourseModule.create({
				name: moduleName,
				courseId: courseId,
			});
			res.redirect(`/admin/courses/detail/${courseId}`);
		} catch (error) {
			console.log(error.message);
			res.render("/error/500");
		}
	},

	edit: async (req, res) => {
		try {
			const { id } = req.params;
			const userName = req.user.name;
			const title = "Sửa tài liệu";

			const moduleVal = await CourseModule.findOne({
				include: {
					model: Course,
				},
				where: {
					id: id,
				},
			});
			const courses = await Course.findAll();

			const permissionUser = await permissionUtils.roleUser(req);

			res.render("admin/courseModule/edit", {
				title,
				moduleName,
				moduleVal,
				courses,
				permissionUser,
				permissionUtils,
				userName,
			});
		} catch (error) {
			console.log(error.message);
			res.render("/error/500");
		}
	},

	update: async (req, res) => {
		try {
			const { id } = req.params;
			const { moduleName, courseId } = req.body;
			await CourseModule.update(
				{
					name: moduleName,
					courseId: courseId,
				},
				{
					where: {
						id: id,
					},
				}
			);
			res.redirect(`/admin/course-modules/edit/${id}`);
		} catch (error) {
			console.log(error.message);
			res.render("/error/500");
		}
	},

	destroy: async (req, res) => {
		try {
			const { id } = req.params;
			const courseId = req.flash("courseId").slice(-1);
			console.log(courseId);
			await CourseModule.destroy({
				where: {
					id: id,
				},
			});
			res.redirect(`/admin/courses/detail/${courseId}`);
		} catch (error) {
			console.log(error.message);
			res.render("/error/500");
		}
	},
};
