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

import { getAllUsers } from "../Utils/apiConnect";

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
        display: "flex",
        flexDirection: "column",
        padding: `${theme.spacing(4)}px ${theme.spacing(8)}px ${
            theme.spacing.unit * 3
        }px`,
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

class GenerateForm extends React.Component {
    state = {
        myArray: [],
        userID: "",
        firstname: "",
        lastname: "",
        organization: "VKU University",
        orgLogo: "https://vku.udn.vn/uploads/no-image.png",
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
        getAllUsers().then((data) => {
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
            <Grid container>
                <Grid item xs={12} sm={8}>
                    <Paper className={classes.paper}>
                        <Typography variant="h3" color="inherit">
                            Certificate Generation Form
                        </Typography>
                        <Form autoComplete="off" onSubmit={this.submitData}>
                            <Container>
                                <Row>
                                    <Col>
                                        <Form.Group
                                            className="mb-3"
                                            controlId="formBasicEmail"
                                        >
                                            <Form.Label>
                                                Select student
                                            </Form.Label>
                                            <Form.Select
                                                aria-label="Default select example"
                                                required
                                                onChange={this.handleChange(
                                                    "userID"
                                                )}
                                            >
                                                <option>
                                                    Click to choose user
                                                </option>
                                                {myArray.map((user, index) => {
                                                    return (
                                                        <option
                                                            value={user._id}
                                                            key={index}
                                                        >
                                                            {user.name}
                                                        </option>
                                                    );
                                                })}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group
                                            className="mb-3"
                                            controlId="formBasicEmail"
                                        >
                                            <Form.Label>
                                                Organization
                                            </Form.Label>
                                            <Form.Control
                                                required
                                                defaultValue={organization}
                                                type="text"
                                                onChange={this.handleChange(
                                                    "organization"
                                                )}
                                                placeholder="Enter organization"
                                            />
                                            <Form.Text className="text-muted">
                                                Student certificate
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group
                                            className="mb-3"
                                            controlId="formBasicEmail"
                                        >
                                            <Form.Label>
                                                Certified for
                                            </Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                onChange={this.handleChange(
                                                    "coursename"
                                                )}
                                                placeholder="Enter certificate name"
                                            />
                                            <Form.Text className="text-muted">
                                                Any course name or skill for
                                                which the certificate is being
                                                given.
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group
                                            className="mb-3"
                                            controlId="formBasicEmail"
                                        >
                                            <Form.Label>
                                                Assigned date
                                            </Form.Label>
                                            <Form.Control
                                                required
                                                type="date"
                                                placeholder="Enter certificate name"
                                                onChange={this.handleChange(
                                                    "assignedOn"
                                                )}
                                            />
                                            <Form.Text className="text-muted">
                                                Assigned date of certificate
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group
                                            className="mb-3"
                                            controlId="formBasicEmail"
                                        >
                                            <Form.Label>Duration</Form.Label>
                                            <Form.Control
                                                type="number"
                                                required
                                                onChange={this.handleChange(
                                                    "duration"
                                                )}
                                                min={0}
                                                placeholder="Enter certificate name"
                                            />
                                            <Form.Text className="text-muted">
                                                Certificate duration
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Button variant="primary" type="submit">
                                            Save certificate
                                        </Button>
                                    </Col>
                                    <Col>
                                        {currentState === "validate" && (
                                            <Typography
                                                variant="caption"
                                                color="inherit"
                                                className={classes.submitBtn}
                                            >
                                                Certificate genrated with id{" "}
                                                <a
                                                    x="500"
                                                    y="700"
                                                    href={
                                                        "/display/certificate/" +
                                                        certificateId
                                                    }
                                                >
                                                    {certificateId}
                                                </a>
                                            </Typography>
                                        )}
                                    </Col>
                                </Row>
                            </Container>
                        </Form>
                        {/* <form
                            className={classes.container}
                            autoComplete="off"
                            onSubmit={this.submitData}
                        >
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    required
                                    id="firstname"
                                    label="First Name"
                                    className={classes.textField}
                                    value={firstname}
                                    onChange={this.handleChange("firstname")}
                                    margin="normal"
                                    variant="outlined"
                                />
                                <TextField
                                    required
                                    id="lastname"
                                    label="Last Name"
                                    className={classes.textField}
                                    value={lastname}
                                    onChange={this.handleChange("lastname")}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    required
                                    id="organization"
                                    label="Organization"
                                    className={classes.textField}
                                    defaultValue={organization}
                                    margin="normal"
                                    variant="outlined"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <TextField
                                    required
                                    id="certified-for"
                                    label="Certified For"
                                    helperText="Any course name or skill for which the certificate is being given."
                                    placeholder="Degree, skill or award.."
                                    className={
                                        (classes.courseField, classes.textField)
                                    }
                                    defaultValue={coursename}
                                    onChange={this.handleChange("coursename")}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    required
                                    id="assigned-date"
                                    label="Assigned Date"
                                    type="date"
                                    margin="normal"
                                    variant="outlined"
                                    onChange={this.handleChange("assignedOn")}
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <TextField
                                    required
                                    id="duration"
                                    label="Duration"
                                    helperText="Duration to be provided in years"
                                    value={duration}
                                    onChange={this.handleChange("duration")}
                                    type="number"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    required
                                    id="email"
                                    label="Email"
                                    className={classes.textField}
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    margin="normal"
                                    variant="outlined"
                                    value={emailId}
                                    onChange={this.handleChange("emailId")}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <SubmitAnimation
                                    currentState={currentState}
                                    className={classes.submitBtn}
                                />
                                {currentState === "validate" && (
                                    <Typography
                                        variant="caption"
                                        color="inherit"
                                        className={classes.submitBtn}
                                    >
                                        Certificate genrated with id{" "}
                                        <a
                                            x="500"
                                            y="700"
                                            href={
                                                "/display/certificate/" +
                                                certificateId
                                            }
                                        >
                                            {certificateId}
                                        </a>
                                    </Typography>
                                )}
                            </Grid>
                        </form> */}
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper className={classes.rightpaper}>
                        <div style={{ maxWidth: "90%" }}>
                            <img
                                src={orgLogo}
                                alt="org-logo"
                                style={{ maxWidth: "100%" }}
                            />
                        </div>
                        <div>
                            <Typography variant="h5" color="inherit" noWrap>
                                {organization}
                            </Typography>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

GenerateForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GenerateForm);
