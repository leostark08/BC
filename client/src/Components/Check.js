import React from "react";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import withStyles from "@material-ui/core/styles/withStyles";
import {
    getAllMessage,
    verifyCertificate,
    sendCertification,
} from "../Utils/apiConnect";

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
        padding: `${theme.spacing(4)}px ${theme.spacing(8)}px ${theme.spacing(
            3
        )}px`,
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
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(
            3
        )}px`,
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
            console.log(data);
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
                <h1>Certificates of friend</h1>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Candidate name</th>
                            <th>Certificate name</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myArray.map((message, index) => {
                            return (
                                <tr key={index}>
                                    <td id="idCer">
                                        <a
                                            href={
                                                "/display/certificate/" +
                                                message.hash
                                            }
                                        >
                                            {message.hash}
                                        </a>
                                    </td>
                                    <td id="">{message.author.name}</td>
                                    <td id="">
                                        {message.certificate.courseName}
                                    </td>
                                    <td id="statusCer">
                                        {message.hash !== undefined ? (
                                            <Badge bg="success">Intact</Badge>
                                        ) : (
                                            <Badge bg="danger">Changed</Badge>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default withStyles(styles)(Check);
