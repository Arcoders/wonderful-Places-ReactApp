const express = require('express');

let router = express.Router();

const placesController = require('../controllers/PlacesController');

router.route('/')
    .get(placesController.index)
    .post(
        placesController.multerMiddleware(), 
        placesController.create,
        placesController.saveImage
    )

router.route('/:slug')
    .get(placesController.find, placesController.show)
    .patch(placesController.find, placesController.update)
    .delete(placesController.find, placesController.destroy)

module.exports = router;