const Visit = require('../models/Visit');
const buildParams = require('./helpers').buildParams;

const validParams = ['_place', 'reaction', 'observation'];

function index(req, res) {
    let promise = null;
    if (req.place) {
        promise = req.place.visits;
    } else if (req.user) {
        promise = Visit.forUser(req.user.id, req.query.page || 1)
    }
    if (promise) {
        promise.then(visits => {
            res.json(visits);
        }).catch(err => {
            res.status(500).json({err});
        });
    } else {
        res.status(404).json({
            error : 'oups'
        });
    }
}

function create(req, res) {
    let params = buildParams(validParams, req.body);
    params['_user'] = req.user.id;
    Visit.create(params).then(visit => {
        res.json(visit);
    }).catch(err => {
        res.status(422).json({
            err
        });
    });
}

function find(req, res, next) {
    Visit.findById(req.params.visit_id).then(visit => {
        req.mainObj = visit,
        req.visit = visit;
        next();
    }).catch(next);
}

function destroy(req, res) {
    req.visit.remove().then(() => {
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