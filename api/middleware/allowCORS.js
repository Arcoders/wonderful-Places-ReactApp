module.exports = function(options) {
    let CORsMiddleware = function(req, res, next) {
        if (req.application) {
            req.application.origins.split(',').forEach(origin => {
                res.header('Access-Control-Allow-Headers', origin);
            });
        } else {
            res.header('Access-Control-Allow-Headers', '*');            
        }
        res.header(
            "Access-Control-Allow-Headers", 
            "Origin, Content-Type, Authorization, Application, Accept, X-Requested-With, remember-me"
        );
        next();
    }
    CORsMiddleware.unless = require('express-unless');

    return CORsMiddleware;
};