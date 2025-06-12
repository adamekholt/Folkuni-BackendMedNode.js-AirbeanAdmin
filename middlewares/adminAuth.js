export default function adminAuth(req, res, next) {
    if (!global.user || global.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin rights is required.'
        });
    }
    next();
} 