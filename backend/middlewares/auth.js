const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing'});
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
       return res.status(401).json({ message: 'Token is missing'});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid Token"});
        }
        // req.user = user;
        req.user = decoded;
        next();
    });
}

module.exports = authenticate;