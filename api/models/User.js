const mongoose = require('mongoose');
const mongooseBcrypt = require('mongoose-bcrypt');
const Place = require('./Place');
const FavoritePlace = require('./FavoritePlace');

let userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: String,
    admin: {
        type: Boolean,
        default: false,
    },
});

userSchema.post('save', function (user, next) {
    User.count({}).then(count => {
        if (count == 1) {
            user.admin = true;
            user.save().then(next())
        } else {
            next();
        }
    });
});

userSchema.virtual('places').get(function () {
    return Place.find({
        '_user': this._id
    });
});

userSchema.virtual('favorites').get(function () {
    return FavoritePlace.find({
        '_user': this._id
    }, {
        '_place': true
    }).then(favorites => {
        let placeIds = favorites.map(favorite => favorite._place);
        return Place.find({
            '_id': {
                $in: placeIds
            }
        })
    });
});


userSchema.plugin(mongooseBcrypt);

const User = mongoose.model('User', userSchema);

module.exports = User;