const moment = require("moment");
const { Op } = require("sequelize");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const SendEmail = require("../../../helpers/SendEmail");
const generatePass = require("../../../utils/generatePass");
const constants = require("../../../constants/index");
const exportFile = require("../../../utils/exportFile");
const importFile = require("../../../utils/importFile");
const { getPaginateUrl } = require("../../../utils/url");
const permissionUtils = require("../../../utils/permissionUtils");
const validate = require("../../../utils/validate");
const model = require("../../../models/index");
const User = model.User;
const UserOtp = model.UserOtp;
const UserSocial = model.UserSocial;
const LoginToken = model.LoginToken;
const UserColumn = model.UserColumn;
const Type = model.Type;
const Role = model.Role;
const Permission = model.Permission;

const moduleName = "Người dùng";

module.exports = {
	index: async (req, res) => {
		try {
			const title = "Danh sách người dùng";
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
						name: "Admin",
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
			const users = await User.findAll({
				include: {
					model: Type,
					where: {
						name: "Admin",
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

			res.render("admin/user/index", {
				req,
				users,
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
			const title = "Thêm người dùng";
			const userName = req.user.name;
			const errors = req.flash("errors");

			const permissionUser = await permissionUtils.roleUser(req);

			res.render("admin/user/add", {
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
				const password = generatePass();

				const type = await Type.findOne({
					where: {
						name: "Admin",
					},
				});

				await User.create({
					name: name,
					email: email,
					password: bcrypt.hashSync(password, saltRounds),
					phone: phone,
					address: address,
					typeId: type.id,
				});

				const html =
					"<b>Mật khẩu để đăng nhập lần đầu là: </b>" + password;
				SendEmail(email, "Mật khẩu đăng nhập lần đầu", html);

				return res.redirect("/admin/users");
			}
			req.flash("errors", result.errors);
			res.redirect("/admin/users/add");
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	edit: async (req, res) => {
		try {
			const { id } = req.params;
			const userName = req.user.name;
			const errors = req.flash("errors");
			const title = "Sửa người dùng";

			const user = await User.findOne({
				where: {
					id: id,
				},
			});

			const permissionUser = await permissionUtils.roleUser(req);

			res.render("admin/user/edit", {
				user,
				title,
				errors,
				validate,
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

	update: async (req, res) => {
		try {
			const { id } = req.params;
			const { name, email, phone, address, password } = req.body;

			const result = validationResult(req);
			if (result.isEmpty()) {
				const type = await Type.findOne({
					where: {
						name: "Admin",
					},
				});
				await User.update(
					{
						name: name,
						email: email,
						phone: phone,
						password: bcrypt.hashSync(password, saltRounds),
						address: address,
						typeId: type.id,
					},
					{
						where: {
							id: id,
						},
					}
				);
				return res.redirect(`/admin/users/edit/${id}`);
			}

			req.flash("errors", result.errors);
			res.redirect(`/admin/users/edit/${id}`);
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	destroy: async (req, res) => {
		try {
			const { id } = req.params;
			const user = await User.findOne({
				where: {
					id: id,
				},
			});
			if (user) {
				await UserOtp.destroy({
					where: { userId: id },
				});
				await UserSocial.destroy({
					where: { userId: id },
				});
				await LoginToken.destroy({
					where: { userId: id },
				});
				// await UserColumn.destroy({
				// 	where: { userId: id },
				// });
				await User.destroy({
					where: { id: id },
				});
			}
			res.redirect("/admin/users");
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	destroyAll: async (req, res) => {
		try {
			const { listUserDelete } = req.body;
			const listIdUser = listUserDelete.split(",");
			await UserOtp.destroy({
				where: {
					userId: {
						[Op.in]: listIdStudent,
					},
				},
			});
			await UserSocial.destroy({
				where: {
					userId: {
						[Op.in]: listIdStudent,
					},
				},
			});
			await LoginToken.destroy({
				where: {
					userId: {
						[Op.in]: listIdStudent,
					},
				},
			});
			await UserColumn.destroy({
				where: {
					userId: {
						[Op.in]: listIdStudent,
					},
				},
			});
			await User.destroy({
				where: {
					id: {
						[Op.in]: listIdUser,
					},
				},
			});
			res.redirect("/admin/users");
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	export: async (req, res) => {
		try {
			const user = await User.findAll({
				include: {
					model: Type,
					where: {
						name: "Admin",
					},
				},
			});
			const columns = constants.userColumnFile;
			const date = new Date().getTime();
			const fileName = `user_admin_${date}.xlsx`;
			exportFile(res, user, "User_Admin", fileName, columns);
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

			res.render("admin/user/import", {
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
					name: "Admin",
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
			res.redirect("/admin/users");
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	permission: async (req, res) => {
		try {
			const title = "Phân quyền";
			const userName = req.user.name;
			const { id } = req.params;

			const user = await User.findOne({
				where: {
					id: id,
				},
			});
			const roles = await Role.findAll();
			const roleUser = await Role.findAll({
				include: {
					model: User,
					where: {
						id: id,
					},
				},
			});

			const permissionUser = await permissionUtils.roleUser(req);

			res.render("admin/user/permission", {
				title,
				moduleName,
				roles,
				user,
				permissionUtils,
				permissionUser,
				roleUser,
				userName,
			});
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	handlePermission: async (req, res) => {
		try {
			const { id } = req.params;
			let { roles } = req.body;
			const user = await User.findOne({
				where: {
					id: id,
				},
			});

			if (!user) {
				return res.redirect("/admin/users");
			}

			if (roles) {
				if (typeof roles === "string") {
					roles = [roles];
				}

				const rolesUpdate = await Promise.all(
					roles.map((roleId) =>
						Role.findOne({
							where: {
								id: roleId,
							},
						})
					)
				);

				await user.setRoles(rolesUpdate);

				return res.redirect(`/admin/users/permission/${id}`);
			}

			return res.redirect("/admin/users");
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	addUserPermission: async (req, res) => {
		try {
			const title = "Thêm quyền cho người dùng";
			const userName = req.user.name;
			const { id } = req.params;

			const user = await User.findOne({
				where: {
					id: id,
				},
			});

			const permissionUser = await permissionUtils.roleUser(req);

			res.render("admin/user/permissionAdd", {
				title,
				moduleName,
				permissionUser,
				permissionUtils,
				user,
				userName,
			});
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},

	storeUserPermission: async (req, res) => {
		try {
			const { id } = req.params;
			const { permission } = req.body;

			const permissionUser = await permissionUtils.roleUser(req);

			const user = await User.findOne({
				where: {
					id: id,
				},
			});

			if (permission) {
				let permissionUserPlus = [];

				if (typeof permission === "string") {
					permissionUserPlus = !permissionUser.includes(
						permission
					) && [permission];
				} else {
					permissionUserPlus = permission.filter(
						(value) => !permissionUser.includes(value)
					);
				}

				await Promise.all(
					permissionUserPlus.map(async (item) => {
						const permissionInstance = await Permission.findOne({
							where: {
								values: item,
							},
						});
						if (permissionInstance) {
							await user.addPermission(permissionInstance);
						} else {
							await user.createPermission({
								values: item,
							});
						}
					})
				);
			}

			res.redirect(`/admin/users/permissions/add/${id}`);
		} catch (error) {
			console.log(error);
			res.render("/error/500");
		}
	},
};
