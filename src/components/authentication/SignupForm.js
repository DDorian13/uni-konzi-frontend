import React, {Component} from "react";
import GlobalValues from "../../global/GlobalValues";
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
            this.setState({ responseMsg: "A jelszavak nem egyeznek meg!"})
            return;
        }

        const body = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
        }

        fetch(GlobalValues.serverURL + "/users/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        }).then(response => {
            return response.json();
        }).then(response => {
            let responseMessage;
            if (response.hasOwnProperty("error")) {
                responseMessage = response.error.match("email") ? "Ezzel az email címmel már regisztráltak" : "Ez a felhasználónév foglalt";
            } else {
                responseMessage = "Sikeres regisztráció"
            }
            this.setState({responseMsg: responseMessage});
        }).catch(error => {
            console.log(error);
            this.setState({
                responseMsg: "Sikertelen regisztráció"
            })
        })
    }

    render() {

        return (
            <div className="myFormContainer">
                <Form onSubmit={this.handleSubmit} className="myForm">
                    <Form.Label className="myFormWelcomeText">Regisztráció</Form.Label>
                    <Form.Group>
                        <Form.Label>Felhasználónév</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={this.state.name}
                            onChange={this.handleChange}
                            required={true}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        required={true}
                    />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Jelszó</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                            required={true}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Jelszó újra</Form.Label>
                        <Form.Control
                            type="password"
                            name="repassword"
                            value={this.state.repassword}
                            onChange={this.handleChange}
                            required={true}
                        />
                    </Form.Group>
                    <Button type="submit" variant="info">Regisztrálás</Button>
                    { this.state.responseMsg !== "" &&
                    <Form.Label
                        className={this.state.responseMsg === "Sikeres regisztráció" ? "myFormSuccessText" : "myFormErrorText"}
                    >
                        {this.state.responseMsg}
                    </Form.Label> }
                    {
                        this.state.responseMsg === "Sikeres regisztráció" &&
                        <Button variant="info" href="/login">Bejelentkezés</Button>
                    }
                </Form>
            </div>
        );
    }
}

export default SignupForm;