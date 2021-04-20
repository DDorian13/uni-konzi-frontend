import React, { Component } from "react";
import {Button, Form} from "react-bootstrap";
import GlobalValues from "../../global/GlobalValues";

class DeleteSubject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedSubjectId: "-1"
        };
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

        await fetch(GlobalValues.serverURL + `/universities/${this.props.university.id}/${this.state.selectedSubjectId}`, {
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


        document.getElementById("overlayOfDelete").style.display = "none";
        this.setState({selectedUniversityId: "-1"});
        if (success) {
            alert("A tantárgy törlése sikeresen megtörtént!");
            window.location.reload();
        } else {
            alert("A tantárgy törlése sikertelen!");
        }
    }

    render() {
        return (
            <div id="overlayOfDelete">
                <Form className="myForm" onSubmit={this.handleSubmit}>
                    <Button
                        variant="outline-danger"
                        className="fa fa-close formCloseButton"
                        onClick={() => document.getElementById("overlayOfDelete").style.display="none"}
                    />
                    <Form.Label className="myFormWelcomeText">Tantárgy törlése</Form.Label>
                    <Form.Group>
                        <Form.Label>Törlendő tantárgy</Form.Label>
                        <Form.Control
                            as="select"
                            name="selectedSubjectId"
                            value={this.state.selectedSubjectId}
                            onChange={this.handleChange}
                        >
                            <option value="-1">Válasszon egy tantárgyat...</option>
                            {this.props.university !== "" && this.props.university.subjects.map(subject =>
                                <option value={subject.id}>{subject.name}</option>
                            )}
                        </Form.Control>
                        <Form.Text>Ez a művelet nem vonható vissza!</Form.Text>
                    </Form.Group>
                    <Button type="submit" variant="danger">Törlés</Button>
                </Form>
            </div>
        );
    }
}

export default DeleteSubject;