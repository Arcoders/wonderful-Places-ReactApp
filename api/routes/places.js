const express = require('express');

let router = express.Router();

const placesController = require('../controllers/PlacesController');
const autenticateOwner = require('../middleware/authenticateOwner');

router.route('/')
    .get(placesController.index)
    .post(
        placesController.multerMiddleware(), 
        placesController.create,
        placesController.saveImage
    )

router.route('/:slug')
    .get(placesController.find, autenticateOwner, placesController.show)
    .patch(placesController.find, autenticateOwner, placesController.update)
    .delete(placesController.find, autenticateOwner, placesController.destroy)

module.exports = router;