const { mongoose } = require("./mongoose");

const MessageSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        trim: true,
    },
    hash: {
        type: String,
        required: true,
        trim: true,
    },
});

module.exports = mongoose.model("message", MessageSchema);
