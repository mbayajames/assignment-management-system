const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer', '');
    if (!token) {
        return res.status(401).json(errorResponse('No token provided'));
    } 
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {error} {
        return res.status(401).json(errorResponse('Invalid token'));
    }
};