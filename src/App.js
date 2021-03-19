import React, {Component} from "react";
import LoginForm from "./components/LoginForm";
import UniList from "./components/UniList";
import SignupForm from "./components/SignupForm";
import SubjectList from "./components/SubjectList";

class App extends Component {
    constructor() {
        super();
        this.state = {}
    }

    render() {
        return (
            <>
                <title>Uni Konzi</title>
                {window.location.pathname === "/" && <LoginForm />}
                {(window.location.pathname === "/universities" || window.location.pathname === "/universities/search") ?
                    <UniList />
                    :
                    (window.location.pathname.search("^(/universities/([a-z]*[0-9]*)*)$") !== -1 && <SubjectList />)
                }
                {window.location.pathname === "/signup" && <SignupForm />}
            </>
        );
    }
}

export default App;