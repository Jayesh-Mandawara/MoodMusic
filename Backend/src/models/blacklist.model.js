const mongoose = require("mongoose");

const blackListSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: [true, "Token is required for blacklisting"],
            unique: true,
        },
    },
    { timestamps: true },
);

const blackListModel = mongoose.model("blacklist", blackListSchema);

module.exports = blackListModel;
