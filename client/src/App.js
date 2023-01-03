import React, { Component } from "react";
import "./App.css";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import Check from "./Components/Check";
import { Switch, Route } from "react-router-dom";
import NavBar from "./Components/NavBar";
import Homepage from "./Components/Homepage";
import Dashboard from "./Components/Dashboard";
import GenerateForm from "./Components/GenerateForm";
import Profile from "./Components/Profile";
import { Helmet } from "react-helmet";
import "bootstrap/dist/css/bootstrap.min.css";
class App extends Component {
    render() {
        return (
            <>
                <>
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Certificate System</title>
                    </Helmet>
                </>
                <div className="App" style={{ backgroundColor: "#fafafa" }}>
                    <NavBar />
                    <Switch>
                        <Route exact path="/" component={Homepage} />
                        <Route path="/sign-in" component={SignIn} />
                        <Route path="/sign-up" component={SignUp} />
                        <Route path="/check" component={Check} />
                        <Route path="/profile" component={Profile} />
                        <Route
                            path="/generate-certificate"
                            component={GenerateForm}
                        />
                        <Route
                            path="/display/certificate/:id"
                            component={Dashboard}
                        />
                    </Switch>
                </div>
            </>
        );
    }
}

export default App;
