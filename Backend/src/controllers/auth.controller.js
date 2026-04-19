const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blackListModel = require("../models/blacklist.model");

async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body;

        const isAlreadyExists = await userModel.findOne({
            $or: [{ email }, { username }],
        });

        if (isAlreadyExists) {
            return res.status(400).json({
                message: "User already exists with username or email",
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hash,
        });

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            },
        );

        res.cookie("token", token);

        return res.json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}

async function loginUser(req, res) {
    try {
        const { username, email, password } = req.body;

        const user = await userModel
            .findOne({
                $or: [{ email }, { username }],
            })
            .select("+password");

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            },
        );

        res.cookie("token", token);

        return res.json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}

async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id);

    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    return res.json({
        message: "User fetched successfully",
        user,
    });
}

async function logoutUser(req, res) {
    const token = req.cookies.token;

    res.clearCookie("token");

    await blackListModel.create({
        token,
    });

    return res.status(200).json({
        message: "User logged out successfully",
    });
}

module.exports = {
    registerUser,
    loginUser,
    getMeController,
    logoutUser,
};
