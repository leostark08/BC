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
app.get("/message", (req, res) => {
    Message.find()
        .then((obj) => {
            if (obj === null)
                res.status(400).send({ err: "Certificate data doesn't exist" });
            else {
                obj.forEach((message, index) => {
                    var bytes = CryptoJS.AES.decrypt(
                        message.hash,
                        message.userID
                    );
                    try {
                        var decryptedData = JSON.parse([
                            bytes.toString(CryptoJS.enc.Utf8),
                        ]);
                    } catch (e) {
                        var decryptedData = undefined;
                    }

                    if (decryptedData !== undefined) {
                        // obj[index].hash = decryptedData[0].privateKey;
                        obj[index].hash =
                            "http://localhost:3001/display/certificate/" +
                            decryptedData[0].certificateID;
                    } else {
                        obj[index].hash = undefined;
                    }

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
                    //                 obj[index].hash =
                    //                     "http://localhost:3001/display/certificate/" +
                    //                     decryptedData[0].certificateID;
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

app.get("/certificate/send/:id", (req, res) => {
    let certificateId = req.params.id;

    Certificates.findById(certificateId)
        .then((obj) => {
            const userID = obj.userID;

            User.findById(userID).then((user) => {
                var data = [
                    {
                        privateKey: user.privateKey,
                        certificateID: certificateId,
                    },
                ];
                const hash = CryptoJS.AES.encrypt(
                    JSON.stringify(data),
                    userID
                ).toString();
                const message = new Message({ userID, hash });
                message.save();
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
    const privateKey = CryptoJS.HmacSHA1(now, "Key");
    const publicKey = CryptoJS.HmacSHA1(now, "Key");
    const user = new User({ name, email, password, publicKey, privateKey });
    user.save()
        .then((obj) => {
            console.log(obj);
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
            if (obj === null)
                res.status(400).send({ err: "Certificate data doesn't exist" });
            else {
                res.send(obj);
            }
        })
        .catch((err) => res.status(400).send({ err: err }));
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
