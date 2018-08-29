const User = require('../models/User');
const buildParams = require('./helpers').buildParams;

const validParams = ['email', 'name', 'password'];

function create(req, res, next) {
    let params = buildParams(validParams, req.body);
    User.create(params).then(user => {
        req.user = user;
        next();
    }).catch(err => res.status(422).json(err));
}

function myPlaces(req, res) {
    User.findOne({
        '_id': req.user.id
    }).then(user => {
        user.places.then(places => {
            res.json(places);
        })
    }).catch(err => res.json(err))
}

module.exports = { create, myPlaces }