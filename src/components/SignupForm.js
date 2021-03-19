import React, {Component} from "react";
import GlobalValues from "../global/GlobalValues";
import {Form, Button} from "react-bootstrap"

class SignupForm extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            repassword: "",
            responseMsg: ""
        };
    }

    handleChange = (event) => {
        const {name, value} = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.password !== this.state.repassword) {
            this.setState({ responseMsg: "A jelszavak különböznek!"})
            return;
        }
        fetch(GlobalValues.serverURL + "/users/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.state)
        }).then(response => this.setState({
            responseMsg: "Sikeres regisztráció"
        })).catch(error => this.setState({
            responseMsg: "Something went wrong"
        }))
    }

    render() {
        return (
            <div className="signupFormContainer">
                <Form onSubmit={this.handleSubmit} className="signupForm">
                    <Form.Label className="signupWelcomeText">Regisztráció</Form.Label>
                    <Form.Group>
                        <Form.Label>Felhasználónév</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={this.state.name}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={this.handleChange}
                    />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Jelszó</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Jelszó újra</Form.Label>
                        <Form.Control
                            type="password"
                            name="repassword"
                            placeholder="Password again"
                            value={this.state.repassword}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Button type="submit" variant="info">Regisztrálás</Button>
                    { this.state.responseMsg !== "" &&
                    <Form.Label
                        className="loginFormError"
                    >
                        {this.state.responseMsg}
                    </Form.Label> }
                </Form>
                <div>
                    <a href="/">Log in</a>
                    {//<h2>{this.state.responseMsg}</h2>
                    }
                </div>
            </div>
        );
    }
}

export default SignupForm;