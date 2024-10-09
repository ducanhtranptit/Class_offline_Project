const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const md5 = require("md5");

const JWT_SECRET = process.env.JWT_SECRET;

const SendMail = require("../../../helpers/SendEmail");
const FormatDate = require("../../../helpers/FormatDate");

const model = require("../../../models/index");
const UserOtp = model.UserOtp;
const User = model.User;
const LoginToken = model.LoginToken;
const Type = model.Type;

const saltRounds = 10;

module.exports = {
	login: (req, res) => {
		const message = req.flash("error");
		res.render("auth/login", {
			layout: "layouts/auth.layout.ejs",
			message,
		});
	},

	handleLogin: async (req, res) => {
		try {
			const { email } = req.body;
			const { id } = req.user;

			const userOtp = await UserOtp.findOne({
				where: {
					userId: id,
				},
			});
			if (userOtp) {
				await UserOtp.destroy({
					where: {
						userId: id,
					},
				});
			}
			const otp = Math.floor(Math.random() * 90000) + 10000;
			const timeExpires = new Date(new Date().getTime() + 60000);
			const html = "<b>Mã xác minh để đăng nhập: </b>" + otp;
			SendMail(email, "Xác minh tài khoản", html);
			await UserOtp.create({
				otp: otp,
				userId: id,
				expires: FormatDate(new Date(timeExpires)),
			});

			const tokenUser = await LoginToken.findOne({
				where: {
					userId: id,
				},
			});

			if (tokenUser) {
				await LoginToken.destroy({
					where: {
						userId: id,
					},
				});
			}

			const token = md5(new Date() + Math.random());
			await LoginToken.create({
				token: token,
				userId: id,
			});
			res.cookie("token", token, { maxAge: 900000, httpOnly: true });

			req.flash("email", email);
			res.redirect("/auth/verification");
		} catch (error) {
			console.log(error.message);
			res.render("/error/500");
		}
	},

	loginGoogle: (req, res) => {
		res.redirect("/admin");
	},

	verification: async (req, res) => {
		try {
			const email = req.flash("email");
			const message = req.flash("message");

			res.render("auth/verification", {
				layout: "layouts/auth.layout.ejs",
				email,
				message,
			});
		} catch (error) {
			console.log(error.message);
			res.render("/error/500");
		}
	},

	handleVerification: async (req, res) => {
		try {
			const {
				numberOne,
				numberTwo,
				numberThree,
				numberFour,
				numberFive,
			} = req.body;
			const { id } = req.user;
			const otp = `${numberOne}${numberTwo}${numberThree}${numberFour}${numberFive}`;

			const user = await UserOtp.findOne({
				where: {
					[Op.and]: [{ otp: otp }, { userId: id }],
				},
			});

			if (user) {
				const timeMoment = new Date();
				const expires = user.expires;
				if (expires < timeMoment) {
					req.flash("message", "Mã OTP đã hết hạn");
					req.flash("email", req.user.email);
					res.redirect("/auth/verification");
					return;
				}

				res.redirect("/admin");
				return;
			}
			req.flash("message", "Mã OTP không chính xác");
			res.redirect("/auth/verification");
		} catch (error) {
			console.log(error.message);
			res.render("/error/500");
		}
	},

	logout: (req, res) => {
		req.logout(function (err) {
			if (err) {
				console.log(err.message);
				return res.render("/error/500");
			}
			res.redirect("/auth/login");
		});
	},

	forgotPassword: (req, res) => {
		res.render("auth/forgotPassword", {
			layout: "layouts/auth.layout.ejs",
		});
	},

	reset: (req, res) => {
		try {
			const { token } = req.query;
			req.flash("token", token);

			res.render("auth/resetPassword", {
				layout: "layouts/auth.layout.ejs",
			});
		} catch (error) {
			console.log(error.message);
			res.render("/error/500");
		}
	},

	handleReset: async (req, res) => {
		try {
			const token = req.flash("token");
			const { password, repassword } = req.body;
			if (password === repassword) {
				try {
					const decoded = jwt.verify(token[0], JWT_SECRET);
					await User.update(
						{ password: bcrypt.hashSync(password, saltRounds) },
						{
							where: {
								email: decoded.data.email,
							},
						}
					);
				} catch (err) {
					console.log(err);
				}
				res.redirect("/auth/login");
			} else {
				res.redirect("/auth/reset");
			}
		} catch (error) {
			console.log(error.message);
			res.render("/error/500");
		}
	},

	resetOtp: async (req, res) => {
		try {
			const { id, email } = req.user;

			const userOtp = await UserOtp.findOne({
				where: {
					userId: id,
				},
			});

			if (userOtp) {
				await UserOtp.destroy({
					where: {
						userId: id,
					},
				});
			}

			const otp = Math.floor(Math.random() * 90000) + 10000;
			const timeExpires = new Date(new Date().getTime() + 15000);
			const html = "<b>Mã xác minh để đăng nhập: </b>" + otp;
			SendMail(email, "Xác minh tài khoản", html);
			await UserOtp.create({
				otp: otp,
				userId: id,
				expires: FormatDate(new Date(timeExpires)),
			});
			req.flash("email", email);
			res.redirect("/auth/verification");
		} catch (error) {
			console.log(error.message);
			res.render("/error/500");
		}
	},

	firstLogin: (req, res) => {
		try {
			res.render("auth/firstLogin", {
				layout: "layouts/auth.layout.ejs",
			});
		} catch (error) {
			console.log(error.message);
			res.render("/error/500");
		}
	},

	handleFirstLogin: async (req, res) => {
		try {
			const { password, repassword } = req.body;
			if (password === repassword) {
				try {
					await User.update(
						{
							password: bcrypt.hashSync(password, saltRounds),
							firstLogin: 1,
						},
						{
							where: {
								email: req.user.email,
							},
						}
					);

					return res.redirect("/admin");
				} catch (err) {
					console.log(err);
				}
			}
		} catch (error) {
			console.log(error.message);
			res.render("/error/500");
		}
	},
};
