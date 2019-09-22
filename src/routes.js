const routes = require('express').Router();
const {User} = require('./app/models')
const SessionController = require("./app/controllers/SessionController");
const AuthController = require("./app/controllers/AuthController");
const authMiddleware = require("./app/middlewares/auth");

routes.post('/sessions', SessionController.store);
routes.use(authMiddleware);
routes.get('/auth', (req, res) => {
    return res.status(200).send();
});
module.exports = routes;