var express = require("express");
var router = express.Router();
const passport = require("passport");

const GuestMiddleware = require("../../http/middlewares/GuestMiddleware");
const AuthMiddleware = require("../../http/middlewares/AuthMiddleware");

const AuthController = require("../../http/controllers/auth/AuthController");

const googleRouter = require("./google");

router.get("/login", GuestMiddleware, AuthController.login);
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/auth/login",
        failureFlash: true,
        badRequestMessage: "Không được để trống",
    }),
    AuthController.handleLogin
);

router.get("/verification", AuthMiddleware, AuthController.verification);
router.post("/verification", AuthController.handleVerification);
router.post("/logout", AuthController.logout);
router.get("/reset", AuthController.reset);
router.post("/reset", AuthController.handleReset);
router.post("/resetOtp", AuthController.resetOtp);
router.get("/first-login", AuthController.firstLogin);
router.patch("/first-login", AuthController.handleFirstLogin);
router.use("/", googleRouter);

module.exports = router;
