import React, {Component} from "react";
import {Form, Button} from "react-bootstrap";
import GlobalValues from "../../global/GlobalValues";
import decodeJWT from "jwt-decode";

class NewSubject extends Component {
    constructor() {
        super();
        this.state = {
            universities: [],
            responseMsg: "",
            code: "",
            name: "",
            selectedUniversity: {}
        }
    }

    componentDidMount() {
        fetch(GlobalValues.serverURL + "/universities?page=1&limit=99999", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem(GlobalValues.tokenStorageName)
            }
        }).then(response => {
            if (!response.ok)
            {
                throw Error("Hiba az egyetemek lekérdezése közben");
            }
            return response.json();
        }).then(response => {
            this.setState({
                universities: response,
                selectedUniversity: response[0].id
            })
        }).catch(error => this.setState({
            responseMsg: error.message
        }));
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const body = {
            name: this.state.name,
            code: this.state.code
        };

        fetch(GlobalValues.serverURL + "/universities/" + this.state.selectedUniversity, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem(GlobalValues.tokenStorageName)
            },
            body: JSON.stringify(body)
        }).then(response => {
            if (response.status === 409) {
                throw Error("A tantárgy már fel van véve");
            } else if (!response.ok) {
                throw Error("Hiba");
            }
            return response.json();
        }).then(response => this.setState({
            responseMsg: "A tantárgy felvétele sikerült",
            code: "",
            name: ""
        })).catch(error => this.setState({
            responseMsg: error.message
        }));
    }

    render() {
        const jwtToken = localStorage.getItem(GlobalValues.tokenStorageName);
        if (jwtToken != null) {
            const decodedToken = decodeJWT(jwtToken);
            if (decodedToken.roles.filter(role => role === GlobalValues.adminRole).length <= 0) {
                alert("Nincs jogosultságod ehhez a művelethez");
                window.history.go(-1);
                return;
            }
        }

        const universities = this.state.universities.map(item =>
            <option value={item.id}>{item.name}</option>
        )

        return (
                <div className="myFormContainer">
                    <Form className="myForm newSubjectForm" onSubmit={this.handleSubmit}>
                        <Form.Label className="myFormWelcomeText">Tantárgy felvétele</Form.Label>
                        <Form.Group>
                            <Form.Label>Egyetem kiválasztása</Form.Label>
                            <Form.Control
                                as="select"
                                value={this.state.selectedUniversity}
                                name="selectedUniversity"
                                onChange={this.handleChange}
                                required={true}
                            >
                                {universities}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Tárgykód</Form.Label>
                            <Form.Control
                                type="text"
                                name="code"
                                value={this.state.code}
                                onChange={this.handleChange}
                                required={true}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Tárgynév</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={this.state.name}
                                onChange={this.handleChange}
                                required={true}
                            />
                        </Form.Group>
                        <Button type="submit" variant="info">Hozzáadás</Button>
                        {
                            this.state.responseMsg !== "" &&
                            <Form.Label className={this.state.responseMsg === "A tantárgy felvétele sikerült" ?
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

export default NewSubject;