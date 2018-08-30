const mongoose = require('mongoose');
const randomstring = require('randomstring');

function assignUniqueRandom(app, field, next) {
    const random = randomstring.generate(20);
    let searchCriteria = {};
    searchCriteria['field'] = random;
    Application.count(searchCriteria).then(count => {
        if (count > 0) return assignUniqueRandom(app, field, next);
        app[field] = random;
        next();
    })
}

let applicationSchema = new mongoose.Schema({
    applicationId: {
        type: String,
        required: true,
        unique: true,
    },
    secret: {
        type: String,
        required: true,
        unique: true,
    },
    origins: {
        type: String,
    },
    name: String,
});

applicationSchema.pre('validate', function(next) {
    assignUniqueRandom(this, 'applicationId', () => {
        assignUniqueRandom(this, 'secret', next);
    });
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;