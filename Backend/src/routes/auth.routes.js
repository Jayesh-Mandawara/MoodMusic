const { Router } = require("express");
const {
    registerUser,
    loginUser,
    getMeController,
    logoutUser,
} = require("../controllers/auth.controller");
const { authUser } = require("../middlewares/auth.middleware");

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get-me", authUser, getMeController);
router.get("/logout", logoutUser);

module.exports = router;
