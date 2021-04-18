import React, {Component} from "react";
import TableList from "../parts/TableList";
import {Button, Form} from "react-bootstrap";
import GlobalValues from "../../global/GlobalValues";
import decodeJWT from "jwt-decode";

class PupilOf extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedSubjectId: "-1",
            response: ""
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if (this.state.selectedSubjectId === "-1") {
            return;
        }

        const token = localStorage.getItem(GlobalValues.tokenStorageName);

        if (token != null) {
            const decodedToken = decodeJWT(token);

            fetch(GlobalValues.serverURL + `/subjects/${this.state.selectedSubjectId}/pupils/${decodedToken.userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            }).then(response => {
                if (!response.ok) {
                    throw Error("Érvénytelen tantárgyazonosító");
                }
                return response.json();
            }).then(() => {
                document.getElementById("overlayForm").style.display = "none";
                this.setState({ selectedSubjectId: "-1"});
                alert("A lejelentkezés sikeresen megtörtént!");
                window.location.reload();
            }).catch(error => alert(error))
        } else {
            document.getElementById("overlayForm").style.display = "none";
            this.setState({ selectedSubjectId: "-1"});
            alert("Hiba a felhasználó elérése közben!\nJelentkezzen be újra!");
        }
    };

    handleChange = (event) => {
        const {name, value} = event.target;
        this.setState({ [name]: value });
    }

    render() {

        const headers = ["Tárgykód", "Név"];
        const valuesFrom = ["code", "name"];

        return (
            <div>
                <div className="topRowContainer">
                    <h2>Konzultációt kérek</h2>
                    <Button
                        variant="danger"
                        onClick={() => document.getElementById("overlayForm").style.display = "flex"}
                    >
                        Lejelentkezés konzultációról...
                    </Button>
                </div>
                <TableList
                    headers={headers}
                    valuesFrom={valuesFrom}
                    isPageable={true}
                    forResponse={this}
                    click={() => {
                    }}
                />

                <div id="overlayForm">
                    <Form className="myForm" onSubmit={this.handleSubmit}>
                        <Button
                            variant="outline-danger"
                            className="fa fa-close formCloseButton"
                            onClick={() => document.getElementById("overlayForm").style.display = "none"}
                        />
                        <Form.Group>
                            <Form.Label>Tárgy</Form.Label>
                            <Form.Control
                                as="select"
                                name="selectedSubjectId"
                                value={this.state.selectedSubjectId}
                                onChange={this.handleChange}
                            >
                                <option value="-1">Válasszon egy tárgyat...</option>
                                {this.state.response &&
                                    this.state.response.map(subject =>
                                        <option value={subject.id}>{subject.code} - {subject.name}</option>
                                    )
                                }
                            </Form.Control>
                        </Form.Group>
                        <Button variant="info" type="submit">Lejelentkezés</Button>
                    </Form>
                </div>
            </div>
        );
    }
}

export default PupilOf;