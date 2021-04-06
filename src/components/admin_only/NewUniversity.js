import React, {Component} from "react"
import GlobalValues from "../../global/GlobalValues";
import {Button, Form} from "react-bootstrap";

class NewUniversity extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            country: "",
            city: "",
            responseMsg: ""
        }
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const body = {
            name: this.state.name,
            country: this.state.country,
            city: this.state.city
        }

        fetch(GlobalValues.serverURL + "/universities",
            {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem(GlobalValues.tokenStorageName)},
                body: JSON.stringify(body)
            }).then(response => {
                if (response.status === 409) {
                    throw Error("Az egyetem már fel van véve");
                } else if (!response.ok) {
                    throw Error("Hiba");
                }
                return response.json();
            }).then(response => this.setState({
                responseMsg: "Az egyetem felvétele sikerült",
                name: "",
                country: "",
                city: ""
            })).catch(error => this.setState({
                responseMsg: error.message
            }));
    }

    render() {
        GlobalValues.hasAdminRole(true);

        return (
                <div className="myFormContainer">
                    <Form className="myForm" onSubmit={this.handleSubmit}>
                        <Form.Label className="myFormWelcomeText">Egyetem felvétele</Form.Label>
                        <Form.Group>
                            <Form.Label>Egyetem neve</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={this.state.name}
                                placeholder="Név"
                                onChange={this.handleChange}
                                required={true}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Ország</Form.Label>
                            <Form.Control
                                type="text"
                                name="country"
                                value={this.state.country}
                                placeholder="Ország"
                                onChange={this.handleChange}
                                required={true}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Város</Form.Label>
                            <Form.Control
                                type="text"
                                name="city"
                                value={this.state.city}
                                placeholder="Város"
                                onChange={this.handleChange}
                                required={true}
                            />
                        </Form.Group>
                        <Button type="submit" variant="info">Hozzáadás</Button>
                        {
                            this.state.responseMsg !== "" &&
                                <Form.Label className={this.state.responseMsg === "Az egyetem felvétele sikerült" ?
                                    "myFormSuccessText"
                                    :
                                    "myFormErrorText"}
                                >
                                    {this.state.responseMsg}
                                </Form.Label>
                        }
                    </Form>
                </div>
        );
    }
}

export default NewUniversity;