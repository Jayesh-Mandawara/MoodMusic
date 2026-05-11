// The token blacklisting is done by the help of MongoDb
const blackListModel = require("../models/blacklist.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authUser(req, res, next) {
    const token = req.cookies.token;

    const isTokenBlacklisted = await blackListModel.findOne({
        token,
    });

    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "Invalid token!",
        });
    };

    if (!token) {
        return res.status(401).json({
            message: "Token not provided!",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Invalid token!",
        });
    }
}

module.exports = {
    authUser,
};
