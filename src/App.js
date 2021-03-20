import React, {Component} from "react";
import LoginForm from "./components/LoginForm";
import UniList from "./components/UniList";
import SignupForm from "./components/SignupForm";
import SubjectList from "./components/SubjectList";
import NewUniversity from "./components/admin_only/NewUniversity";
import NewSubject from "./components/admin_only/NewSubject";

class App extends Component {
    constructor() {
        super();
        this.state = {}
    }

    render() {
        let item;
        const pathname = window.location.pathname
        if (pathname === "/") {
            item = <LoginForm />;
        } else if (pathname === "/universities" || pathname === "/universities/search") {
            item = <UniList />;
        } else if (pathname === "/universities/new") {
            item = <NewUniversity />
        } else if (pathname === "/universities/newsubject") {
            item = <NewSubject />;
        } else if (pathname.search("^(/universities/([a-z]*[0-9]*)*)$") !== -1) {
            item = <SubjectList />;
        } else if (pathname === "/signup") {
            item = <SignupForm />;
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