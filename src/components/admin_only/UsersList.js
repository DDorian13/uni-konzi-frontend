import React, {Component} from "react";
import TableList from "../parts/TableList";
import {Button, Form} from "react-bootstrap";
import GlobalValues from "../../global/GlobalValues";

class UsersList extends Component {
    constructor() {
        super();
        this.state = {
            response: [],
            selectedUserId: "-1"
        }
    }

    componentDidMount() {
        fetch(GlobalValues.serverURL + "/users?page=1&limit=999999999", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem(GlobalValues.tokenStorageName)
            }
        }).then(response => {
            if (!response.ok) {
                throw Error("Nem sikerült a felhasználók lekérése");
            }
            return response.json();
        }).then(response => {
            this.setState({response: response});
        }).catch(error => console.log(error));
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSubmitAdmin = (event) => {
        event.preventDefault();
        if (this.state.selectedUserId === "-1") {
            return;
        }
        document.getElementById("overlayOfNew").style.display = "none";
        fetch(GlobalValues.serverURL + "/users/" + this.state.selectedUserId, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem(GlobalValues.tokenStorageName)
            }
        }).then(response => {
            if (!response.ok) {
                throw Error("Nem létezik ez a felhasználó!");
            }
            console.log("Jogosultság hozzáadva!");
            window.location.pathname = "/users";
        }).catch(error => console.log(error));

        this.setState({ selectedUserId: "-1" });
    }

    handleSubmitDelete = (event) => {
        event.preventDefault();
        if(this.state.selectedUserId === "-1") {
            return;
        }
        document.getElementById("overlayOfDelete").style.display = "none";

        fetch(GlobalValues.serverURL + "/users/" + this.state.selectedUserId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem(GlobalValues.tokenStorageName)
            }
        }).then(response => {
            if (!response.ok) {
                throw Error("Törlés nem sikerült");
            }
            console.log("Felhasználó törölve!");
            window.location.pathname = "/users";
        }).catch(error => console.log(error));

        this.setState({ selectedUserId: "-1"})
    }

    render() {
        GlobalValues.hasAdminRole(true);

        const headers = ["Azonosító", "Név", "Email cím", "Jogosultságok"];
        const valuesFrom = ["id", "name", "email", "roles"];

        const items = this.state.response.map(item =>
            <option value={item.id}>{item.name} - {item.email}</option>
        )

        return (
            <div>
                <div className="topRowContainer">
                    <Button
                        variant="info"
                        onClick={() => document.getElementById("overlayOfNew").style.display = "flex"}
                    >
                        Admin jogosultság adása...
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => document.getElementById("overlayOfDelete").style.display = "flex"}
                    >
                        Felhasználó törlése...
                    </Button>
                </div>

                <div id="overlayOfNew">
                    <Form className="myForm" onSubmit={this.handleSubmitAdmin}>
                        <Button
                            variant="outline-danger"
                            onClick={() => document.getElementById("overlayOfNew").style.display = "none"}
                            className="fa fa-close formCloseButton"
                        />
                        <Form.Group>
                            <Form.Label>Új admin</Form.Label>
                            <Form.Control
                                as="select"
                                name="selectedUserId"
                                value={this.state.selectedUserId}
                                onChange={this.handleChange}
                            >
                                <option value={-1}>Válasszon egy felhasználót...</option>
                                {items}
                            </Form.Control>
                        </Form.Group>
                        <Button type="submit" variant="info">Jogosultság adása</Button>
                    </Form>
                </div>

                <div id="overlayOfDelete">
                    <Form className="myForm" onSubmit={this.handleSubmitDelete}>
                        <Button
                            variant="outline-danger"
                            onClick={() => document.getElementById("overlayOfDelete").style.display = "none"}
                            className="fa fa-close formCloseButton"
                        />
                        <Form.Group>
                            <Form.Label>Törlendő felhasználó</Form.Label>
                            <Form.Control
                                as="select"
                                name="selectedUserId"
                                value={this.state.selectedUserId}
                                onChange={this.handleChange}
                            >
                                <option value={-1}>Válasszon egy felhasználót...</option>
                                {items}
                            </Form.Control>
                            <Form.Text>Ez a művelet nem vonható vissza!</Form.Text>
                        </Form.Group>
                        <Button type="submit" variant="danger">Törlés</Button>
                    </Form>
                </div>

                <TableList
                    headers={headers}
                    valuesFrom={valuesFrom}
                    responseAttribute=""
                    isPageable={true}
                    click={() => {}}
                />
            </div>
        );
    }
}

export default UsersList;