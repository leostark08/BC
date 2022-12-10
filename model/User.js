const { mongoose } = require("./mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    publicKey: {
        type: String,
        required: false,
        trim: true,
    },
    privateKey: {
        type: String,
        required: false,
        trim: true,
    },
});

module.exports = mongoose.model("user", UserSchema);
