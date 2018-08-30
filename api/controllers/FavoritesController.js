const FavoritePlace = require('../models/FavoritePlace');
const buildParams = require('./helpers').buildParams;

const validParams = ['_place'];

function index(req, res) {
    if (!req.fullUser) return res.json({});
    req.fullUser.favorites.then(favorites => {
        res.json(favorites);
    }).catch(err => res.json(err));
}

function create(req, res) {
    let params = buildParams(validParams, req.body);
    params['_user'] = req.user.id;
    FavoritePlace.create(params).then(favorite => {
        res.json(favorite);
    }).catch(err => {
        res.status(422).json({
            err
        });
    });
}

function find(req, res, next) {
    FavoritePlace.findById(req.params.id).then(favorite => {
        req.mainObj = favorite,
        req.favorite = favorite;
        next();
    }).catch(next);
}

function destroy(req, res) {
    req.favorite.remove().then(() => {
        res.json({
            messaje: 'deleted sucss...',
        })
    }).catch(err => res.status(500).json({
        err
    }))
}

module.exports = {
    create,
    find,
    destroy,
    index,
};