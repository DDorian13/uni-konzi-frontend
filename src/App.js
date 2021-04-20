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

        let item;
        const pathname = window.location.pathname
        if (pathname === "/") {
            item = <Home />;
        } else if (pathname === "/signup") {
            item = <SignupForm />;
        } else if (pathname === "/login") {
            item = <LoginForm />;
        } else if (pathname === "/universities" || pathname === "/universities/search") {
            item = <UniList />;
        } else if (pathname.search("^(/universities/([a-f]|[0-9]){24})$") !== -1) {
            item = <SubjectList />;
        } else if (pathname === "/users") {
            item = <UsersList />;
        } else if (pathname === "/chat") {
            item = <Chat />;
        } else if (pathname === "/subjects/tutor-of") {
            item = <TutorOf />;
        } else if (pathname === "/subjects/pupil-of") {
            item = <PupilOf />;
        } else if (pathname.search("^(/subjects/([a-f]|[0-9]){24})/pupils$") !== -1) {
            item = <PupilsOfSubject />
        } else if (pathname === "/subjects/search") {
            item = <SubjectList search={true} />
        } else if (pathname.search("^/subjects/([a-f]|[0-9]){24}") !== -1) {
            item = <SubjectComment />;
        }

        return (
            <>
                <Header />
                <title>Uni Konzi</title>
                {item}
            </>
        );
    }
}

export default App;