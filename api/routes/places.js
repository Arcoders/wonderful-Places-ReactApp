const express = require('express');

let router = express.Router();

const placesController = require('../controllers/PlacesController');

router.route('/')
    .get(placesController.index)
    .post(placesController.create)

router.route('/:id')
    .get(placesController.show)
    .patch(placesController.update)
    .delete(placesController.destroy)

module.exports = router;