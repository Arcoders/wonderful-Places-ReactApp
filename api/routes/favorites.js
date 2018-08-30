const express = require('express');

let router = express.Router();

const favoritesController = require('../controllers/FavoritesController');
const autenticateOwner = require('../middleware/authenticateOwner');
const findUser = require('../middleware/findUser');

const jwtMiddleware = require('express-jwt');
const secrets = require('../config/secrets');

router.route('/')
    .get(
        jwtMiddleware({
            secret: secrets.jwtSecret
        }),
        findUser,
        favoritesController.index
    )
    .post(favoritesController.create)

router.route('/:id')
    .delete(favoritesController.find, autenticateOwner, favoritesController.destroy)

module.exports = router;