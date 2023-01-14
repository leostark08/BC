const { mongoose } = require("./mongoose");

const MessageSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        trim: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        trim: true,
    },
    certificate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "certificates",
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
