const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const uploader = require('./Uploader');
const slugify = require('../plugins/slugify');

let placeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
    },
    address: String,
    description: String,
    acceptsCreditCard: {
        type: Boolean,
        default: false,
    },
    coverImage: String,
    avatarImage: String,
    openHour: Number,
    closeHour: Number,
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

placeSchema.pre('save', function(next) {
    if (this.slug) return next();
    generateSlugAndContinue.call(this, 0, next);
});

placeSchema.statics.validateSlug = function(slug) {
    return Place.count({
        slug,
    }).then(count => (count > 0) ? false : true);
}

placeSchema.methods.updateImage = function(path, type) {
    return uploader(path).then(secureUrl => this.saveImageUrl(secureUrl, type));
}

placeSchema.methods.saveImageUrl = function(secureUrl, type) {
    this[type + 'Image'] = secureUrl;
    return this.save();
}

placeSchema.plugin(mongoosePaginate);

function generateSlugAndContinue(count, next) {
    this.slug = slugify(this.title);
    if (count != 0) {
        this.slug = this.slug + '-' + count;
    };
    Place.validateSlug(this.slug).then(isValid => {
        if (!isValid) {
            return generateSlugAndContinue.call(this, count+1, next);
        }
        next();
    })
}

let Place = mongoose.model('Place', placeSchema);

module.exports = Place;