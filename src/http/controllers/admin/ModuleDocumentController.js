const permissionUtils = require("../../../utils/permissionUtils");

const model = require("../../../models/index");
const Course = model.Course;
const CourseModule = model.CourseModule;
const ModuleDocument = model.ModuleDocument;

const moduleName = "Tài liệu";

module.exports = {
	add: async (req, res) => {
		try {
			const title = "Thêm nội dung tài liệu";
			const userName = req.user.name;
			const courseModule = await CourseModule.findAll({
				include: {
					model: Course,
				},
			});

			const permissionUser = await permissionUtils.roleUser(req);

			res.render("admin/moduleDocument/add", {
				title,
				moduleName,
				courseModule,
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
			const courseId = req.flash("courseId").slice(-1);
			const { documentContent, pathName, moduleId } = req.body;

			await ModuleDocument.create({
				content: documentContent,
				pathName: pathName,
				moduleId: moduleId,
			});
			res.redirect(`/admin/courses/detail/${courseId}`);
		} catch (error) {
			console.log(error.message);
			res.render("/error/500");
		}
	},

	edit: async (req, res) => {
		try {
			const title = "Sửa nội dung tài liệu";
			const userName = req.user.name;
			const { id } = req.params;
			const moduleDocument = await ModuleDocument.findOne({
				where: {
					id: id,
				},
			});
			const courseModule = await CourseModule.findAll({
				include: {
					model: Course,
				},
			});

			const permissionUser = await permissionUtils.roleUser(req);

			res.render("admin/moduleDocument/edit", {
				title,
				moduleName,
				moduleDocument,
				courseModule,
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
			const { documentContent, pathName, moduleId } = req.body;
			await ModuleDocument.update(
				{
					content: documentContent,
					pathName: pathName,
					moduleId: moduleId,
				},
				{
					where: {
						id: id,
					},
				}
			);
			res.redirect(`/admin/module-documents/edit/${id}`);
		} catch (error) {
			console.log(error.message);
			res.render("/error/500");
		}
	},

	destroy: async (req, res) => {
		try {
			const { id } = req.params;
			const courseId = req.flash("courseId").slice(-1);
			await ModuleDocument.destroy({
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
