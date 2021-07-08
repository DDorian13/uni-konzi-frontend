import React, {Component} from "react";
import LoginForm from "./components/authentication/LoginForm";
import UniList from "./components/UniList";
import SignupForm from "./components/authentication/SignupForm";
import SubjectList from "./components/SubjectList";
import Home from "./components/Home";
import UsersList from "./components/admin_only/UsersList";
import GlobalValues from "./global/GlobalValues";
import decodeJWT from "jwt-decode";
import SubjectComment from "./components/SubjectComment";
import Header from "./components/parts/Header";
import Chat from "./components/Chat";
import TutorOf from "./components/konzi/TutorOf";
import PupilOf from "./components/konzi/PupilOf";
import PupilsOfSubject from "./components/konzi/PupilsOfSubject";
import { Route, Switch } from "react-router-dom";

class App extends Component {
    constructor() {
        super();
        this.state = {}
    }

    render() {
        let token = localStorage.getItem(GlobalValues.tokenStorageName);
        if (token !== null) {
            token = decodeJWT(token);
            if (token.exp * 1000 < Date.now()) {
                localStorage.removeItem(GlobalValues.tokenStorageName);
                window.location.pathname = "/";
            }
        }

        return (
            <>
                <Header />
                <title>Uni Konzi</title>
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route exact path="/signup">
                        <SignupForm />
                    </Route>
                    <Route exact path="/login">
                        <LoginForm />
                    </Route>
                    <Route exact path={"/universities" || "/universities/search"}>
                        <UniList />;
                    </Route>
                    <Route exact path="/universities/:universityId">
                        <SubjectList />
                    </Route>
                    <Route exact path="/users">
                        <UsersList />;
                    </Route>
                    <Route exact path="/chat">
                        <Chat />;
                    </Route>
                    <Route exact path="/subjects/tutor-of">
                        <TutorOf />;
                    </Route>
                    <Route exact path="/subjects/pupil-of">
                        <PupilOf />;
                    </Route>
                    <Route exact path="/subjects/:subjectId/pupils">
                        <PupilsOfSubject />
                    </Route>
                    <Route exact path="/subjects/search">
                        <SubjectList search={true} />
                    </Route>
                    <Route exact path="/subjects/:subjectId">
                        <SubjectComment />
                    </Route>
                </Switch>
            </>
        );
    }
}

export default App;