const isAdminorManager = (req, res, next) => {
    if(req.user.role === 'admin' || req.user.role === 'manager') {
        req.isAdminorManager = true;
        next();
    } else {
        res.status(403).json({ message: "Access denied" });
    }
}

module.exports = isAdminorManager;