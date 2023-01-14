require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const log = require("./utils/log");
const path = require("path");
const CryptoJS = require("crypto-js");

if (process.env.NODE_ENV === undefined) process.env.NODE_ENV = "development";
const Certificates = require("./model/Certificates");
const User = require("./model/User");
const Message = require("./model/Message");
const { send } = require("express/lib/response");
const EncryptRsa = require("encrypt-rsa").default;

// create instance
const encryptRsa = new EncryptRsa();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// logger
app.use((req, res, next) => {
    const now = new Date().toString().slice(4, 24);
    res.on("finish", () => {
        log.Logger(`${now} ${req.method} ${res.statusCode} ${req.url}`);
    });
    next();
});

// CORS
if (process.env.NODE_ENV !== "production") app.use(require("cors")());

app.get("/certificate/data/:id", (req, res) => {
    let certificateId = req.params.id;
    Certificates.findById(certificateId)
        .populate("userID")
        .then((obj) => {
            console.log(obj);
            if (obj === null)
                res.status(400).send({ err: "Certificate data doesn't exist" });
            else res.send(obj);
        })
        .catch((err) => res.status(400).send({ err }));
});
app.get("/message/:id", (req, res) => {
    let userID = req.params.id;
    Message.find({ receiver: userID })
        .populate("receiver")
        .populate("author")
        .populate("certificate")
        .then((obj) => {
            if (obj === null)
                res.status(400).send({ err: "Certificate data doesn't exist" });
            else {
                obj.forEach((message, index) => {
                    try {
                        var decryptedData =
                            encryptRsa.decryptStringWithRsaPrivateKey({
                                text: message.hash,
                                privateKey: message.receiver.privateKey,
                            });
                    } catch (e) {
                        var decryptedData = undefined;
                    }
                    obj[index].hash = decryptedData;
                    console.log(obj);
                    // if (decryptedData !== undefined) {
                    //     obj[index].status = true;
                    // } else {
                    //     obj[index].status = false;
                    // }

                    // User.findById(message.userID)
                    //     .then((user) => {
                    //         var bytes = CryptoJS.AES.decrypt(
                    //             message.hash,
                    //             message.userID
                    //         );
                    //         var decryptedData = JSON.parse(
                    //             bytes.toString(CryptoJS.enc.Utf8)
                    //         );
                    //         if (decryptedData[0].privateKey !== undefined) {
                    //             if (
                    //                 user.privateKey ==
                    //                 decryptedData[0].privateKey
                    //             ) {
                    //                 obj[index].hash = true
                    //             } else {
                    //                 obj[index].hash = "";
                    //             }
                    //         }

                    //         res.send(obj);
                    //     })
                    //     .catch((err) => res.status(400).send({ err }));
                });
                res.send(obj);
            }
        })
        .catch((err) => res.status(400).send({ err: err }));
});

app.get("/certificate/verify/:id", (req, res) => {
    let certificateId = req.params.id;

    Certificates.findById(certificateId)
        .then((obj) => {
            obj.verifyData().then((verified) => {
                if (verified) res.status(200).send();
                else res.status(401).send();
            });
        })
        .catch((err) =>
            res
                .status(400)
                .send({ err: "No data found for the given certificateId" })
        );
});

app.get("/certificate/send/:loggedId/:receiveID/:id", (req, res) => {
    let certificateId = req.params.id;
    let receiveID = req.params.receiveID;
    let loggedId = req.params.loggedId;

    Certificates.findById(certificateId)
        .then((obj) => {
            User.findById(receiveID).then((user) => {
                var pbk = user.publicKey;
                const encryptedText = encryptRsa.encryptStringWithRsaPublicKey({
                    text: certificateId,
                    publicKey: pbk,
                });
                // var data = [
                //     {
                //         privateKey: user.privateKey,
                //         certificateID: certificateId,
                //     },
                // ];
                // const hash = CryptoJS.AES.encrypt(
                //     JSON.stringify(data),
                //     userID
                // ).toString();
                const message = new Message({
                    author: loggedId,
                    receiver: receiveID,
                    certificate: certificateId,
                    hash: encryptedText,
                });
                message.save().then((obj) => {
                    res.status(200).send({
                        obj,
                    });
                });
            });
        })
        .catch((err) =>
            res
                .status(400)
                .send({ err: "No data found for the given certificateId" })
        );
});

app.post("/sign-up", (req, res) => {
    const { name, email, password } = req.body;
    const now = new Date().toString().slice(4, 24);
    const { privateKey, publicKey } = encryptRsa.createPrivateAndPublicKeys();
    const user = new User({ name, email, password, publicKey, privateKey });
    user.save()
        .then((obj) => {
            if (obj === null)
                res.status(400).send({ err: "Create new user failure!" });
            else
                res.status(201).send({
                    data: obj,
                });
        })
        .catch((err) => {
            res.status(400).send({ err });
        });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email, password: password })
        .then((obj) => {
            if (obj === null)
                res.status(400).send({ err: "User data doesn't exist" });
            else
                res.status(201).send({
                    data: obj,
                });
        })
        .catch((err) => res.status(400).send({ err }));
});

app.post("/certificate/generate", (req, res) => {
    const { userID, orgName, courseName, assignDate, duration } = req.body;

    const given = new Date(assignDate);

    let expirationDate = given.setFullYear(given.getFullYear() + duration);

    expirationDate = expirationDate.toString();

    const certificate = new Certificates({
        userID,
        orgName,
        courseName,
        expirationDate,
        assignDate,
        duration,
    });

    certificate
        .save()
        .then((obj) => {
            const dbRes = obj.toJSON();
            obj.appendBlockchain()
                .then((data) => {
                    const { transactionHash, blockHash } = data.receipt;
                    res.status(201).send({
                        receipt: {
                            transactionHash,
                            blockHash,
                        },
                        data: dbRes,
                    });
                })
                .catch((err) => res.status(500).send(err));
        })
        .catch((err) => {
            log.Error(err);
            res.status(400).send();
        });
});

app.get("/users", (req, res) => {
    User.find({ role: 0 })
        .then((obj) => {
            if (obj === null) res.status(400).send({ err: "No user" });
            else {
                res.send(obj);
            }
        })
        .catch((err) => res.status(400).send({ err: err }));
});
app.get("/certificates", (req, res) => {
    Certificates.find()
        .populate("userID")
        .then((obj) => {
            if (obj === null) res.status(400).send({ err: "No certificate" });
            else {
                res.send(obj);
            }
        })
        .catch((err) => res.status(400).send({ err: err }));
});
app.get("/profile/:id", (req, res) => {
    let userID = req.params.id;

    Certificates.find({ userID: userID })
        .then((obj) => {
            res.send(obj);
        })
        .catch((err) =>
            res
                .status(400)
                .send({ err: "No data found for the given certificateId" })
        );
});
app.get("/friends/:id", (req, res) => {
    let userID = req.params.id;

    User.find({ _id: { $ne: userID } })
        .then((obj) => {
            res.send(obj);
        })
        .catch((err) =>
            res
                .status(400)
                .send({ err: "No data found for the given certificateId" })
        );
});

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
    log.Info(
        `This is a ${process.env.NODE_ENV} environment.\nServer is up on port ${port}`
    );
});

module.exports = { app };
