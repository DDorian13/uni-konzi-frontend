import React, {Component} from "react";
import TableList from "./parts/TableList";
import {Button, Form} from "react-bootstrap";
import GlobalValues from "../global/GlobalValues";

class SubjectList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: "",
            selectedSubjectId: "-1"
        }
    }

    handleClick = (row) => {
        const id = row.getAttribute("itemID");
        const url = new URL(window.location);
        url.pathname = `/subjects/${id}`
        let keys = [];
        url.searchParams.forEach((value, key) => {
            keys.push(key);
        })
        keys.forEach(key => {
            url.searchParams.delete(key);
        })
        window.location = url;
    }

    handleChange = (event) => {
        const {name, value} = event.target;
        this.setState({ [name]: value});
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        if (this.state.selectedSubjectId === "-1") {
            return;
        }
        let success = true;

        await fetch(GlobalValues.serverURL + `/universities/${this.state.response.id}/${this.state.selectedSubjectId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem(GlobalValues.tokenStorageName)
            }
        }).then(response => {
            if (!response.ok) {
                throw Error("Hiba");
            }
            return response.json();
        })
            .then(response => console.log(response))
            .catch(error => {
                console.log(error);
                success = false;
            })


        document.getElementById("overlayForm").style.display = "none";
        this.setState({selectedUniversityId: "-1"});
        if (success) {
            alert("A tantárgy törlése sikeresen megtörtént!");
            window.location.reload();
        } else {
            alert("A tantárgy törlése sikertelen!");
        }
    }

    render() {
        const headers = ["Tárgykód", "Név"];
        const valuesFrom = ["code", "name"];
        const responseAttribute = "subjects";

        const admin = GlobalValues.hasAdminRole(false);

        if (this.props.search) {
            return (
                <div>
                    <TableList
                        headers={headers}
                        valuesFrom={valuesFrom}
                        isPageable={true}
                        click={this.handleClick}
                    />
                </div>
            );
        } else {
            return (
                <div>
                    {admin &&
                    <>
                        <div className="topRowContainer">
                            <h2>{this.state.response.name}</h2>
                            <Button
                                variant="danger"
                                onClick={() => document.getElementById("overlayForm").style.display="flex"}
                            >
                                Tantárgy törlése...
                            </Button>
                        </div>

                        <div id="overlayForm">
                            <Form className="myForm" onSubmit={this.handleSubmit}>
                                <Button
                                    variant="outline-danger"
                                    className="fa fa-close formCloseButton"
                                    onClick={() => document.getElementById("overlayForm").style.display="none"}
                                />
                                <Form.Group>
                                    <Form.Label>Törlendő tantárgy</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="selectedSubjectId"
                                        value={this.state.selectedSubjectId}
                                        onChange={this.handleChange}
                                    >
                                        <option value="-1">Válasszon egy tantárgyat...</option>
                                        {this.state.response !== "" && this.state.response.subjects.map(subject =>
                                            <option value={subject.id}>{subject.name}</option>
                                        )}
                                    </Form.Control>
                                    <Form.Text>Ez a művelet nem vonható vissza!</Form.Text>
                                </Form.Group>
                                <Button type="submit" variant="danger">Törlés</Button>
                            </Form>
                        </div>
                    </>
                    }
                    <TableList
                        headers={headers}
                        valuesFrom={valuesFrom}
                        isPageable={true}
                        responseAttribute={responseAttribute}
                        forResponse={this}
                        click={this.handleClick}
                    />
                </div>
            );
        }
    }
}

export default SubjectList;