import React, { Component } from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import ChainImage from "../Images/chainT.png";
import { addUser } from "../Utils/apiConnect";

const styles = (theme) => ({
    hidden: {
        [theme.breakpoints.down("sm")]: {
            display: "none",
        },
    },
    paper: {
        [theme.breakpoints.up("sm")]: {
            borderRadius: "5%",
            marginRight: 30,
        },
        [theme.breakpoints.up(1150)]: {
            marginLeft: 50,
        },
        marginTop: theme.spacing(6),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${
            theme.spacing.unit * 3
        }px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
        height: 100,
        width: 100,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing(3),
    },
    media: {
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${
            theme.spacing.unit * 3
        }px`,
    },
    imgstyles: {
        maxWidth: "70vw",
        maxHeight: "90vh",
        [theme.breakpoints.down(1200)]: {
            marginTop: theme.spacing(4),
        },
    },
});

class SignUp extends Component {
    state = {
        name: "",
        email: "",
        password: "",
    };

    handleChange = (name) => (event) => {
        this.setState({ [name]: event.target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({ currentState: "load" });
        const { name, email, password } = this.state;
        addUser(name, email, password).then((res) => {
            if (res !== undefined) {
                if (res.status) this.props.history.push("sign-in");
            } else console.log("sign up err");
        });
    };

    render() {
        const { classes } = this.props;
        const { name, email, password } = this.state;
        return (
            <div>
                <Grid container style={{ height: "100%" }}>
                    <Grid className={classes.hidden} item sm={false} md={7}>
                        <img
                            className={classes.imgstyles}
                            src={ChainImage}
                            alt="chain"
                        />
                    </Grid>
                    <Grid item sm={12} md={5}>
                        <Paper className={classes.paper}>
                            <Typography component="h1" variant="h5">
                                Sign Up
                            </Typography>
                            <form
                                className={classes.form}
                                onSubmit={this.handleSubmit}
                                method="POST"
                            >
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="name">Name</InputLabel>
                                    <Input
                                        id="name"
                                        name="name"
                                        onChange={this.handleChange("name")}
                                    />
                                </FormControl>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="email">
                                        Email Address
                                    </InputLabel>
                                    <Input
                                        id="email"
                                        name="email"
                                        autoComplete="email"
                                        autoFocus
                                        onChange={this.handleChange("email")}
                                    />
                                </FormControl>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="password">
                                        Password
                                    </InputLabel>
                                    <Input
                                        name="password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        onChange={this.handleChange("password")}
                                    />
                                </FormControl>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            value="remember"
                                            color="primary"
                                        />
                                    }
                                    label="Remember me"
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Sign in
                                </Button>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

SignUp.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignUp);
