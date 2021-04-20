import React, {Component} from "react"
import GlobalValues from "../../global/GlobalValues";
import {Button, Form} from "react-bootstrap";

class NewUniversity extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            country: "",
            city: ""
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
            }).then(response =>
                this.setState({
                    name: "",
                    country: "",
                    city: ""
                }, () => {
                    alert("Az egyetem felvétele sikerült");
                    window.location.reload();
                })
            ).catch(error => {
                console.log(error)
                alert(error.message);
        });
    }

    render() {
        GlobalValues.hasAdminRole(true);

        return (
                <div id="overlayOfNew">
                    <Form className="myForm" onSubmit={this.handleSubmit}>
                        <Button
                            variant="outline-danger"
                            onClick={() => document.getElementById("overlayOfNew").style.display="none"}
                            className="fa fa-close formCloseButton"
                        />
                        <Form.Label className="myFormWelcomeText">Egyetem felvétele</Form.Label>
                        <Form.Group>
                            <Form.Label>Egyetem neve</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={this.state.name}
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
                                onChange={this.handleChange}
                                required={true}
                            />
                        </Form.Group>
                        <Button type="submit" variant="info">Hozzáadás</Button>
                    </Form>
                </div>
        );
    }
}

export default NewUniversity;