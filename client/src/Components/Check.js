import React from "react";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import VerifyBadge from "./VerifyBadge";
import FailureBadge from "./FailureBadge";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";
import HelpIcon from "@material-ui/icons/Help";
import LockIcon from "@material-ui/icons/Lock";
import {
    getAllMessage,
    getCertificate,
    verifyCertificate,
    sendCertification,
} from "../Utils/apiConnect";
import Loader from "./Loader";
import Certificate from "./Certificate";

const styles = (theme) => ({
    root: {
        minHeight: "91.5vh",
    },
    paper: {
        [theme.breakpoints.down("sm")]: {
            padding: `${theme.spacing(2)}px`,
            margin: theme.spacing(2),
        },
        minHeight: "75vh",
        maxWidth: "95%",
        margin: theme.spacing(5),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${theme.spacing(4)}px ${theme.spacing(8)}px ${
            theme.spacing.unit * 3
        }px`,
    },
    rightpaper: {
        [theme.breakpoints.up("sm")]: {
            maxHeight: "105vh",
        },
        [theme.breakpoints.down("sm")]: {
            maxWidth: "95%",
            margin: theme.spacing(2),
        },
        maxWidth: "60%",
        minWidth: "60%",
        margin: theme.spacing(5),
        display: "flex",
        flexDirection: "column",
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${
            theme.spacing.unit * 3
        }px`,
    },
    verificationBox: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyItems: "center",
        height: "100%",
        marginTop: theme.spacing(3),
    },
    textitems: {
        margin: "20px 10px",
        textAlign: "center",
    },
});

class Check extends React.Component {
    state = {
        myArray: [],
        verified: false,
        authorized: false,
        loading: false,
        pageLoad: true,
        info: {
            candidateName: "",
            orgName: "",
            courseName: "",
            assignDate: null,
            expirationDate: null,
        },
        logo: "https://vku.udn.vn/uploads/no-image.png",
    };

    verification = () => {
        this.setState({ loading: true });
        verifyCertificate(this.state.certificateId).then((success) => {
            this.setState({
                authorized: success,
                verified: true,
                loading: false,
            });
        });
    };

    send = () => {
        sendCertification(this.state.certificateId);
    };

    componentDidMount() {
        getAllMessage().then((data) => {
            this.setState({ myArray: data });
        });
    }

    render() {
        const { classes } = this.props;
        const {
            myArray,
            authorized,
            verified,
            loading,
            pageLoad,
            certificateId,
            logo,
        } = this.state;
        const {
            userID,
            candidateName,
            orgName,
            courseName,
            assignDate,
            expirationDate,
        } = this.state.info;
        const tooltipInfo = `This verifies whether the certification is secured and stored with correct information in the blockchain`;

        return (
            <div className="container">
                <h1> Certification List</h1>
                <ul>
                    {myArray.map((message) => {
                        if (message.hash !== null) {
                            return (
                                <li>
                                    <a href={message.hash}>{message._id}</a>
                                </li>
                            );
                        } else return "a";
                    })}
                </ul>
            </div>
        );
    }
}

export default withStyles(styles)(Check);
