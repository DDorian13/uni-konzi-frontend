import React, {Component} from "react"
import GlobalValues from "../global/GlobalValues";

class LoginForm extends Component {
    constructor() {
        super();
        this.state = {
            username: "",
            password: "",
            isLoading: false,
            logInMessage: ""
        };
    }

    handleChange = (event) => {
        const {name, value} = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        this.setState({ isLoading: true});
        await fetch(GlobalValues.serverURL + "/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state)
        })
            .then(response => {
                if (!response.ok)
                    throw Error("Invalid credentials")
                return response.json()
            })
            .then(response => {
                const {tokenType, accessToken} = response;
                this.setState({
                    isLoading: false,
                    logInMessage: "Successfully logged in"
                })
                localStorage.setItem(GlobalValues.tokenStorageName, tokenType + accessToken);
                localStorage.setItem(GlobalValues.userName, this.state.username)
                //window.location.href = "/universities";
            })
            .catch(error => this.setState({
                isLoading: false,
                logInMessage: error.message
            }));
    }

    render() {
        return(
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        value={this.state.username}
                        placeholder="Username"
                        onChange={this.handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        value={this.state.password}
                        placeholder="Password"
                        onChange={this.handleChange}
                    />
                    <button>Log in</button>
                </form>
                <div>
                    <a href="/universities">Universities</a>
                    <br/>
                    <a href="/signup">Sign up</a>
                    <p>{this.state.isLoading ? "Loading..." : this.state.logInMessage}</p>
                </div>
            </div>
        );
    }
}

export default LoginForm