// This is not the appropriate way to blacklist the token but instead of this we can use Reddis 
// which is very fast as compared to MongoDB.
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
