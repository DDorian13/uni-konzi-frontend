import React, {Component} from "react"
import GlobalValues from "../../global/GlobalValues";
import {Form, Button} from "react-bootstrap";

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

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({ isLoading: true});

        const body = {
            username: this.state.username,
            password: this.state.password
        }
        fetch(GlobalValues.serverURL + "/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                if (!response.ok)
                    throw Error("Sikertelen bejelentkezés")
                return response.json()
            })
            .then(response => {
                const {tokenType, accessToken} = response;
                this.setState({
                    isLoading: false,
                    logInMessage: "Sikeres bejelentkezés"
                })
                localStorage.setItem(GlobalValues.tokenStorageName, tokenType + accessToken);
                window.location.href = "/universities";
            })
            .catch(error => this.setState({
                isLoading: false,
                logInMessage: error.message
            }));
    }

    render() {
        const showResponseMsg = this.state.logInMessage !== "";
        return(
            <div className="myFormContainer">
                <Form onSubmit={this.handleSubmit} className="myForm">
                    <Form.Label className="myFormWelcomeText">Üdvözöljük!</Form.Label>
                    <Form.Group>
                        <Form.Label>Felhasználónév</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={this.state.username}
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
                    <Button variant="info" type="submit">Belépés</Button>
                    { showResponseMsg &&
                    <Form.Label
                        className={this.state.logInMessage === "Sikeres bejelentkezés" ? "myFormSuccessText" : "myFormErrorText"}
                    >
                        {this.state.logInMessage}
                    </Form.Label> }
                </Form>
            </div>
        );
    }
}

export default LoginForm