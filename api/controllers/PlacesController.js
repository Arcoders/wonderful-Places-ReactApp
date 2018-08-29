const Place = require('../models/Place');
const upload = require('../config/upload');
const helpers = require('./helpers');

const validParams = [
    'title',
    'description',
    'address',
    'acceptsCreditCard',
    'openHour',
    'closeHour',
]

function find(req, res, next) {
    Place.findOne({
        slug: req.params.slug
    }).then(place => {
        req.place = place;
        req.mainObj = place;
        next();
    }).catch(err => next(err));
}

function index(req, res) {

    Place.paginate({}, {
        page: req.query.page || 1,
        limit: 8,
        sort: {
            '_id': -1
        }
    }).then(docs => {
        res.json(docs);
    }).catch(err => res.json(err));

}

function show(req, res) {

    res.json(req.place);

}

function create(req, res, next) {

    const params = helpers.buildParams(validParams, req.body);
    params['_user'] = req.user.id;

    Place.create(params).then(doc => {
        req.place = doc;
        next();
    }).catch(err => next(err))

}

function update(req, res) {

    req.place = Object.assign(
        req.place, 
        helpers.buildParams(validParams, req.body)
    );

    req.place.save().then(doc => {
        res.json(doc);
    }).catch(err => res.json(err));

}

function destroy(req, res) {

    req.place.remove().then(() => {
        res.json({
            message: 'Place deleted...',
        });
    }).catch(err => res.json(err));

}

function multerMiddleware() {
    return upload.fields([
        {
            name: 'avatar', maxCount: 1,
        },
        {
            name: 'cover', maxCount: 1,
        }
    ]);
}

function saveImage(req, res) {
    if (req.place) {
        const promises = [];
        ['avatar', 'cover'].forEach(type => {
            if (req.files && req.files[type]) {
                const path = req.files[type][0].path;
                promises.push(req.place.updateImage(path, type));
            }
        });
        Promise.all(promises).then(() => {
            res.json(req.place);
        }).catch(err => res.json(err));
    } else {
        res.status(422).json({
            error: req.error || 'Cloud not save place',
        });
    }
}

module.exports = {
    index,
    create,
    show,
    update,
    destroy,
    find,
    multerMiddleware,
    saveImage,
}