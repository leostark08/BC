const getHeader = {
    headers: {
        Accept: "application/json",
    },
};

const postHeader = {
    method: "POST",
    headers: {
        ...getHeader,
        "Content-Type": "application/json",
    },
};

let host = "";

if (process.env.NODE_ENV !== "production") host = "http://localhost:3000";

export const getCertificate = (certificateId) =>
    fetch(`${host}/certificate/data/${certificateId}`, getHeader)
        .then((res) => res.json())
        .catch((err) => {
            console.log(err);
        });

export const verifyCertificate = (certificateId) =>
    fetch(`${host}/certificate/verify/${certificateId}`, getHeader)
        .then((res) => {
            if (res.status === 200) return true;
            else if (res.status === 401) return false;
        })
        .catch((err) => {
            console.log(err);
        });

export const generateCertificate = (
    userID,
    courseName,
    orgName,
    assignDate,
    duration
) =>
    fetch(`${host}/certificate/generate`, {
        ...postHeader,
        body: JSON.stringify({
            userID,
            courseName,
            orgName,
            assignDate,
            duration,
        }),
    })
        .then((res) => res.json())
        .catch((err) => {
            console.log(err);
        });

export const addUser = (name, email, password) =>
    fetch(`${host}/sign-up`, {
        ...postHeader,
        body: JSON.stringify({
            name,
            email,
            password,
        }),
    });

export const login = (email, password) =>
    fetch(`${host}/login`, {
        ...postHeader,
        body: JSON.stringify({
            email,
            password,
        }),
    })
        .then((res) => res.json())
        .catch((err) => {
            console.log(err);
        });
export const sendCertification = (loggedId, receiveID, certificateId) => {
    fetch(
        `${host}/certificate/send/${loggedId}/${receiveID}/${certificateId}`,
        getHeader
    )
        .then((res) => {
            if (res.status === 200) return true;
            else if (res.status === 401) return false;
        })
        .catch((err) => {
            console.log(err);
            return false;
        });
};

export const getAllMessage = () => {
    const user = localStorage.getItem("user");
    const loggedUser = JSON.parse(user);
    return fetch(`${host}/message/${loggedUser._id}`, getHeader)
        .then((res) => res.json())
        .catch((err) => {
            console.log(err);
        });
};

export const getAllUsers = () =>
    fetch(`${host}/users/`, getHeader)
        .then((res) => res.json())
        .catch((err) => {
            console.log(err);
        });
export const getAllCertificates = () =>
    fetch(`${host}/certificates/`, getHeader)
        .then((res) => res.json())
        .catch((err) => {
            console.log(err);
        });
export const getCertificates = (userID) =>
    fetch(`${host}/profile/${userID}`, getHeader)
        .then((res) => res.json())
        .catch((err) => {
            console.log(err);
        });
export const getFriends = (userID) =>
    fetch(`${host}/friends/${userID}`, getHeader)
        .then((res) => res.json())
        .catch((err) => {
            console.log(err);
        });
