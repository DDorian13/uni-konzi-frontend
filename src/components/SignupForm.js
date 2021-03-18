import React, {Component} from "react";
import GlobalValues from "../global/GlobalValues";

class SignupForm extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            responseMsg: ""
        };
    }

    handleChange = (event) => {
        const {name, value} = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        fetch(GlobalValues.serverURL + "/users/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.state)
        }).then(response => this.setState({
            responseMsg: "Successfully signed up"
        })).catch(error => this.setState({
            responseMsg: "Something went wrong"
        }))
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={this.state.name}
                        onChange={this.handleChange}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={this.handleChange}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.handleChange}
                    />

                    <button>Sign up</button>
                </form>
                <div>
                    <a href="/">Log in</a>
                    <h2>{this.state.responseMsg}</h2>
                </div>
            </div>
        );
    }
}

export default SignupForm;