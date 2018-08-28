const mongoose = require('mongoose');

const dbName = 'placesApi';

module.exports = {
    connect: () => mongoose.connect(`mongodb://localhost/${dbName}`),
    dbName,
    connection: () => {
        return (mongoose.conection) ? mongoose.connection : this.connect;
    },
};