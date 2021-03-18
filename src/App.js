import React, {Component} from "react";
import LoginForm from "./components/LoginForm";
import TableList from "./components/TableList";
import SignupForm from "./components/SignupForm";

class App extends Component {
    constructor() {
        super();
        this.state = {
            fromUrl: "/universities/603ec60d16e0c83eab40974c",
            // headers: ["Egyetem neve", "Ország", "Város"],
            // valuesFrom: ["name", "country", "city"]
            headers: ["Tárgykód", "Név"],
            valuesFro: ["code", "name"]
        }
    }

    handleClick = (row) => {
        const key = row.getAttribute("accessKey");
        const _fromUrl = "/universities/" + key;
        const _headers = ["Tárgykód", "Név"];
        const _valuesFrom = ["code", "name"];
        this.setState({
            fromUrl: _fromUrl,
            headers: _headers,
            valuesFrom: _valuesFrom
        })
        //window.location.pathname = _fromUrl;
    }

    render() {
        return (
            <div>
                <title>Uni Konzi</title>
                {window.location.pathname === "/" && <LoginForm />}
                {window.location.pathname.includes("/universities") &&
                    <TableList
                        fromUrl={this.state.fromUrl}
                        headers={this.state.headers}
                        valuesFrom={this.state.valuesFrom}
                        click={this.handleClick}
                    />}
                {window.location.pathname === "/signup" && <SignupForm />}
                <span>{this.state.fromUrl}</span>
            </div>
        );
    }
}

export default App;