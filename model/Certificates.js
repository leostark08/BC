const { mongoose } = require("./mongoose");
const truffle_connect = require("../utils/connection");

truffle_connect.connectWeb3();

const CertificateSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        trim: true,
    },
    orgName: {
        type: String,
        required: true,
        trim: true,
    },
    courseName: {
        type: String,
        required: true,
        trim: true,
    },
    expirationDate: {
        type: Number,
        required: true,
        trim: true,
    },
    assignDate: {
        type: Number,
        required: true,
        trim: true,
    },
    duration: {
        type: Number,
        required: true,
        trim: true,
    },
});

CertificateSchema.methods.toJSON = function () {
    const data = this;
    const obj = data.toObject();

    return {
        ...obj,
        certificateId: obj._id.toString(),
        _id: undefined,
        __v: undefined,
    };
};

CertificateSchema.methods.verifyData = function () {
    const data = this;
    const certificateId = data._id.toString();
    return truffle_connect
        .getCertificateData(certificateId)
        .then((blockData) => {
            const responseObject = {
                userID: blockData[0],
                orgName: blockData[1],
                courseName: blockData[2],
                expirationDate: parseInt(blockData[3]),
            };
            const databaseObject = {
                userID: data.userID,
                orgName: data.orgName,
                courseName: data.courseName,
                expirationDate: data.expirationDate,
            };
            if (
                JSON.stringify(responseObject) ===
                JSON.stringify(databaseObject)
            )
                return true;
            else throw false;
        })
        .catch((err) => {
            return false;
        });
};

CertificateSchema.methods.appendBlockchain = function () {
    const data = this;

    const { userID, orgName, courseName, expirationDate } = data;

    const certificateId = data._id.toString();
    const userID2string = userID.toString();

    return truffle_connect.generateCertificate(
        certificateId,
        userID2string,
        orgName,
        courseName,
        expirationDate
    );
};

const Certificates = mongoose.model("certificates", CertificateSchema);

module.exports = Certificates;
