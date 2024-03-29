import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import SubmitAnimation from "./SubmitAnimation";
import { generateCertificate } from "../Utils/apiConnect";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";

import { getCertificates } from "../Utils/apiConnect";

const styles = (theme) => ({
    container: {
        display: "flex",
        flexWrap: "wrap",
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        [theme.breakpoints.up("sm")]: { width: 250 },
        [theme.breakpoints.down("sm")]: { width: 200 },
    },
    dense: {
        marginTop: 16,
    },
    menu: {
        width: 200,
    },
    paper: {
        [theme.breakpoints.down("sm")]: {
            margin: theme.spacing.unit,
            padding: `${theme.spacing(2)}px`,
        },
        // minHeight: "75vh",
        borderRadius: "7px",
        maxWidth: "95%",
        margin: theme.spacing(5),
        marginBottom: 0,
        display: "flex",
        flexDirection: "column",
        padding: `${theme.spacing(4)}px ${theme.spacing(8)}px ${theme.spacing(
            3
        )}px`,
    },
    rightpaper: {
        [theme.breakpoints.up("sm")]: {
            maxHeight: "75vh",
        },
        [theme.breakpoints.down("sm")]: {
            maxWidth: "95%",
            margin: theme.spacing(2),
        },
        // maxWidth: "60%",
        // minWidth: "60%",
        marginTop: theme.spacing(5),
        marginRight: theme.spacing(5),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
    courseField: {
        [theme.breakpoints.up("sm")]: {
            width: "60%",
        },
        [theme.breakpoints.down("sm")]: {
            minWidth: "80vw",
        },
    },
    submitBtn: {
        marginLeft: "50px",
    },
});

class Profile extends React.Component {
    state = {
        myArray: [],
        userID: "",
        firstname: "",
        lastname: "",
        organization: "VKU University",
        orgLogo: "https://vku.udn.vn/uploads/no-image.png",
        img: "https://media-exp1.licdn.com/dms/image/C561BAQEwutKnLTswTg/company-background_10000/0/1526381277588?e=2147483647&v=beta&t=pl3EK6S6X5XoFxPfg6vTR0Pj2xhkXyEJLBn0RedMb6Y",
        coursename: "",
        assignedOn: null,
        duration: 0,
        currentState: "normal",
        emailId: "",
    };

    handleChange = (name) => (event) => {
        this.setState({
            [name]: event.target.value,
        });
    };

    submitData = (event) => {
        event.preventDefault();
        if (this.state.currentState === "validate") {
            return;
        }
        this.setState({ currentState: "load" });
        const { userID, organization, coursename, assignedOn, duration } =
            this.state;
        let assignDate = new Date(assignedOn).getTime();
        generateCertificate(
            userID,
            coursename,
            organization,
            assignDate,
            parseInt(duration)
        )
            .then((data) => {
                if (data.data !== undefined)
                    this.setState({
                        currentState: "validate",
                        certificateId: data.data.certificateId,
                    });
            })
            .catch((err) => console.log(err));
    };

    componentDidMount() {
        const user = localStorage.getItem("user");
        const loggedUser = JSON.parse(user);
        getCertificates(loggedUser._id).then((data) => {
            this.setState({ myArray: data });
        });
    }

    render() {
        const { classes } = this.props;
        const {
            myArray,
            userID,
            firstname,
            lastname,
            organization,
            coursename,
            duration,
            currentState,
            orgLogo,
            emailId,
            certificateId,
        } = this.state;
        return (
            <>
                <Grid container>
                    <Grid item xs={12} sm={12}>
                        <Card
                            className="bg-dark text-white"
                            style={{ margin: 40, height: 200 }}
                        >
                            <Card.Img
                                src={this.state.img}
                                alt="Card image"
                                style={{ height: 200, objectFit: "cover" }}
                            />
                        </Card>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} sm={12}>
                        <Paper className={classes.paper}>
                            <Typography variant="h3" color="inherit">
                                List of All Certificates
                            </Typography>
                            <Container>
                                <Row>
                                    {myArray.map((certificate, index) => {
                                        return (
                                            <Col
                                                key={index}
                                                sm={4}
                                                style={{ marginTop: 30 }}
                                            >
                                                <Card>
                                                    <Card.Img
                                                        variant="top"
                                                        src={this.state.orgLogo}
                                                    />
                                                    <Card.Body>
                                                        <Card.Title>
                                                            {
                                                                certificate.courseName
                                                            }
                                                        </Card.Title>
                                                        <Card.Text>
                                                            {
                                                                certificate
                                                                    .userID.name
                                                            }
                                                        </Card.Text>
                                                        <Button
                                                            href={
                                                                "/display/certificate/" +
                                                                certificate.certificateId
                                                            }
                                                            variant="success"
                                                        >
                                                            View detail
                                                        </Button>
                                                    </Card.Body>
                                                    <Card.Footer>
                                                        <Typography
                                                            variant="caption"
                                                            color="inherit"
                                                            noWrap
                                                        >
                                                            Assigned on:{" "}
                                                            {Intl.DateTimeFormat(
                                                                "en-US",
                                                                {
                                                                    year: "numeric",
                                                                    month: "2-digit",
                                                                    day: "2-digit",
                                                                }
                                                            ).format(
                                                                certificate.assignDate
                                                            )}
                                                        </Typography>
                                                        <br />
                                                        <Typography
                                                            variant="caption"
                                                            color="inherit"
                                                            noWrap
                                                        >
                                                            Expires on:{" "}
                                                            {Intl.DateTimeFormat(
                                                                "en-US",
                                                                {
                                                                    year: "numeric",
                                                                    month: "2-digit",
                                                                    day: "2-digit",
                                                                }
                                                            ).format(
                                                                certificate.expirationDate
                                                            )}
                                                        </Typography>
                                                    </Card.Footer>
                                                </Card>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </Container>
                        </Paper>
                    </Grid>
                </Grid>
            </>
        );
    }
}

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);
