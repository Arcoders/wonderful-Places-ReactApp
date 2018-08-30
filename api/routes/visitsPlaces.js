const express = require('express');

let router = express.Router();

const VisitsController = require('../controllers/VisitsController');
const autenticateOwner = require('../middleware/authenticateOwner');
const placesController = require('../controllers/PlacesController');

router.route('/:slug/visits')
    .get(placesController.find, VisitsController.index)
    .post(placesController.find, VisitsController.create)

router.route('/:id/visits/:visit_id')
    .delete(VisitsController.find, autenticateOwner, VisitsController.destroy)

module.exports = router;