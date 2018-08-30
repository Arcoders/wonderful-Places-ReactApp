module.exports = function (req, res, next) {
    console.log(req.fullUser.admin, ' kk')
    if (req.fullUser && req.fullUser.admin) return next();
    next(new Error('No permissions...'));
};