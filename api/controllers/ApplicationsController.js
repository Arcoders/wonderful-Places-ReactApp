const Application = require('../models/Application');
const buildParams = require('./helpers').buildParams;

const validParams = ['name', 'origins'];

function index(req, res) {
    
}

function create(req, res) {
    let params = buildParams(validParams, req.body);
    Application.create(params).then(app => {
        res.json(app);
    }).catch(err => {
        res.status(422).json({
            err
        });
    });
}

function find(req, res, next) {
    Application.findById(req.params.id).then(app => {
        req.mainObj = app,
            req.application = app;
        next();
    }).catch(next);
}

function destroy(req, res) {
    req.application.remove().then(() => {
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