const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false,
    },
});

// These both are the types of middlewares in mongoose that runs before and after the operation on the schema
// userSchema.pre("save", function(next) {})
// userSchema.post("save", function(next) {})

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
