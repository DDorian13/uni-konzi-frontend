import React, {Component} from "react";
import LoginForm from "./components/LoginForm";
import UniList from "./components/UniList";
import SignupForm from "./components/SignupForm";
import SubjectList from "./components/SubjectList";
import NewUniversity from "./components/admin_only/NewUniversity";
import NewSubject from "./components/admin_only/NewSubject";
import Home from "./components/Home";
import UsersList from "./components/admin_only/UsersList";

class App extends Component {
    constructor() {
        super();
        this.state = {}
    }

    render() {
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
        } else if (pathname === "/universities/new") {
            item = <NewUniversity />;
        } else if (pathname === "/universities/newsubject") {
            item = <NewSubject />;
        } else if (pathname.search("^(/universities/([a-z]*[0-9]*)*)$") !== -1) {
            item = <SubjectList />;
        } else if (pathname === "/users") {
            item = <UsersList />;
        }

        return (
            <>
                <title>Uni Konzi</title>
                {item}
            </>
        );
    }
}

export default App;