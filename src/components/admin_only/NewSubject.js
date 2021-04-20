import React, {Component} from "react";
import {Form, Button} from "react-bootstrap";
import GlobalValues from "../../global/GlobalValues";

class NewSubject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            responseMsg: "",
            code: "",
            name: ""
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
            code: this.state.code
        };

        fetch(GlobalValues.serverURL + "/universities/" + this.props.universityId, {
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
        }).then(response =>
            this.setState({
                code: "",
                name: ""
            }, () => {
                alert("A tantárgy felvétele sikerült")
                window.location.reload();
            })
        ).catch(error => {
            console.log(error);
            alert(error.message)
        });
    }

    render() {
        GlobalValues.hasAdminRole(true);

        return (
                <div id="overlayOfNew" className="myFormContainer">
                    <Form className="myForm newSubjectForm" onSubmit={this.handleSubmit}>
                        <Button
                            variant="outline-danger"
                            onClick={() => document.getElementById("overlayOfNew").style.display="none"}
                            className="fa fa-close formCloseButton"
                        />
                        <Form.Label className="myFormWelcomeText">Tantárgy felvétele</Form.Label>

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