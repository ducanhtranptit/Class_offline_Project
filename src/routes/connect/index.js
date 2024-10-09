var express = require("express");
var routes = express.Router();
const passport = require("passport");

const ConnectController = require("../../http/controllers/connect/ConnectController");


routes.get(
    "/google/redirect",
    passport.authenticate("connectGoogle", {
        prompt: "select_account",
    })
);

routes.get(
    "/google/callback",
    passport.authenticate("connectGoogle", {
        failureRedirect: "/auth/login",
        failureMessage: true,
    }),
    ConnectController.connectGoogle
);

routes.get("/google/destroy", ConnectController.disconnectGoogle);

module.exports = routes;
