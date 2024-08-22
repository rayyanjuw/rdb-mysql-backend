const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        console.log('req.user:', req.user);
        const { role } = req.user || {};
        if (!role || (roles.length && !roles.includes(role))) {
            return res.status(403).json({ message: 'Forbidden'})
        }
        next();
    }
}

module.exports = authorize;