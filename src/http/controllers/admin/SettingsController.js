const permissionUtils = require("../../../utils/permissionUtils");

const moduleName = "Cài đặt";

module.exports = {
	index: async (req, res) => {
		try {
			const title = "Thiết lập cài đặt";
			const userName = req.user.name;

			const permissionUser = await permissionUtils.roleUser(req);
			res.render("admin/settings/index", {
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
};
