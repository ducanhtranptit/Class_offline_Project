module.exports = (req, res, next) => {
    if (!req.user.firstLogin) {
        return res.redirect("/auth/first-login");
    }
    next();
};
