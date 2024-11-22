const model = require("../../models/index");
const Type = model.Type;
module.exports = async (req, res, next) => {
    const type = await Type.findOne({
        where: {
            id: req.user.typeId,
        },
    });

    if (type.name === "TA") {
        type.name = "Teacher";
    }
    const rolePath = `/${type.name.toLowerCase()}`;
    if (req.originalUrl.startsWith(rolePath)) {
        return next();
    } else {
        const isNotStudent = /\/(teacher|admin)/.test(req.originalUrl);
        if (isNotStudent) {
            if (type.name === "Student") {
                return res.render("error/404.ejs", {
                    layout: "layouts/auth.layout.ejs",
                });
            } else {
                return res.redirect(rolePath); 
            }
        } else {
            if (req.originalUrl === "/" && !(type.name === "Student")) {
                return res.redirect(rolePath);
            } else {
                return next();
            }
        }
    }
};
