import React, {Component} from "react";
import TableList from "../parts/TableList";
import {Button, Form} from "react-bootstrap";
import GlobalValues from "../../global/GlobalValues";
import decodeJWT from "jwt-decode";

class PupilsOfSubject extends Component{
    constructor() {
        super();
        this.state = {
            response: {},
            selectedUserId: "-1"
        }
    }

    handleChange = (event) => {
        const {name, value} = event.target;
        this.setState({ [name]: value })
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if (this.state.selectedUserId === "-1") {
            return;
        }

        const token = localStorage.getItem(GlobalValues.tokenStorageName);

        if (decodeJWT(token).userId === this.state.selectedUserId) {
            alert("Saját magadnak nem tudsz konzultációt tartani!");
            return;
	}

        const body = {
            senderId: decodeJWT(token).userId,
            recipientId: this.state.selectedUserId
        }

        fetch(GlobalValues.serverURL + "/messages/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(body)
        }).then(response => response.json())
            .then(response => console.log(response))
            .catch(error => console.log(error));

        fetch(GlobalValues.serverURL + window.location.pathname + `/${body.recipientId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        }).then(response => response.json())
            .then(response => console.log(response))
            .catch(error => console.log(error));

        document.getElementById("overlayForm").style.display = "none";
        alert("A kapcsolatfelvétel sikeres.\nAz üzenetek fülön megtalálható.");
        const url = window.location.protocol + "//" + window.location.host + "/chat?current=" + this.state.selectedUserId;
        window.location = url;
    }

    render() {
        const headers = ["Név", "Email"];
        const valuesFrom = ["name", "email"];

        let users = [<option value="-1">Válasszon egy felhasználót...</option>];
        if (this.state.response.hasOwnProperty("pupils")){
            users.push(this.state.response.pupils.map(pupil =>
                <option value={pupil.id}>{pupil.name} - {pupil.email}</option>
            ));
        }

        return (
            <div>
                <div className="pupilsOfHead">
                    <h2>{this.state.response && this.state.response.name} - Konzultációt kértek</h2>
                    <Button
                        variant="info"
                        onClick={() => document.getElementById("overlayForm").style.display = "flex"}
                    >
                        Konzi tartás...
                    </Button>
                </div>
                <TableList
                    headers={headers}
                    valuesFrom={valuesFrom}
                    responseAttribute="pupils"
                    forResponse={this}
                    isPageable={true}
                    click={() => {
                    }}
                />

                <div id="overlayForm">
                    <Form className="myForm" onSubmit={this.handleSubmit}>
                        <Button
                            variant="outline-danger"
                            onClick={() => document.getElementById("overlayForm").style.display = "none"}
                            className="fa fa-close formCloseButton"
                        />
                        <Form.Control
                            as="select"
                            className="mt-2"
                            name="selectedUserId"
                            value={this.state.selectedUserId}
                            onChange={this.handleChange}
                        >
                            {users}
                        </Form.Control>
                        <Button type="submit" variant="info">Segítség nyújtás</Button>
                    </Form>
                </div>
            </div>
        );
    }
}

export default PupilsOfSubject;