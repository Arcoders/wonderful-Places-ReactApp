const express = require('express');

let router = express.Router();

const applicationsController = require('../controllers/ApplicationsController');
const findUser = require('../middleware/findUser');
const authenticateAdmin = require('../middleware/authenticateAdmin');

const jwtMiddleware = require('express-jwt');
const secrets = require('../config/secrets');

router.all('*', jwtMiddleware({
    secret: secrets.jwtSecret
}), findUser, authenticateAdmin);

router.route('/')
    .get(applicationsController.index)
    .post(applicationsController.create)

router.route('/:application_id')
    .delete(applicationsController.find, applicationsController.destroy)

module.exports = router;