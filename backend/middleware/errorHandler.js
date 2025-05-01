const { errorResponse } = require('../utils/response');

module.exports = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json(errorResponse('Internal server error', err.message));
};