const express = require('express');

let router = express.Router();

const VisitsController = require('../controllers/VisitsController');
const autenticateOwner = require('../middleware/authenticateOwner');

const jwtMiddleware = require('express-jwt');
const secrets = require('../config/secrets');

router.route('/')
    .get(
        jwtMiddleware({
            secret: secrets.jwtSecret
        }),
        VisitsController.index
    )
    .post(VisitsController.create)

router.route('/:visit_id')
    .delete(VisitsController.find, autenticateOwner, VisitsController.destroy)

module.exports = router;