import React, { Component } from "react";
import {Button, Form} from "react-bootstrap";
import GlobalValues from "../../global/GlobalValues";

class DeleteUniversity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedUniversityId: "-1"
        };
    }

    handleChange = (event) => {
        const {name, value} = event.target;
        this.setState({ [name]: value });
    }

    deleteSubject = (universityId, subjectId) => {
        fetch(GlobalValues.serverURL + `/universities/${universityId}/${subjectId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem(GlobalValues.tokenStorageName)
            }
        }).then(response => response.json())
            .then(response => console.log(response))
            .catch(error => console.log(error));
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        if (this.state.selectedUniversityId === "-1") {
            return;
        }

        const universityId = this.state.selectedUniversityId;
        let success = true;

        await fetch(GlobalValues.serverURL + `/universities/${universityId}?page=1&limit=99999`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem(GlobalValues.tokenStorageName)
            }
        }).then(response => response.json())
            .then(response => {
                for (let subject of response.subjects) {
                    this.deleteSubject(universityId, subject.id);
                }
            }).catch(error => {
                console.log(error);
                success = false;
            })

        if (success) {
            await fetch(GlobalValues.serverURL + `/universities/${universityId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem(GlobalValues.tokenStorageName)
                }
            }).then(response => response.json())
                .then(response => console.log(response))
                .catch(error => {
                    console.log(error);
                    success = false;
                })

            if (success) {
                alert("Az egyetem t??rl??se sikeresen megt??rt??nt!");
            } else {
                alert("A t??rl??s sikertelen!");
            }
        }
        document.getElementById("overlayOfDelete").style.display = "none";
        this.setState({selectedUniversityId: "-1"});
        window.location.reload();
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
                    <Form.Label className="myFormWelcomeText">Egyetem t??rl??se</Form.Label>
                    <Form.Group>
                        <Form.Label>T??rlend?? egyetem</Form.Label>
                        <Form.Control
                            as="select"
                            name="selectedUniversityId"
                            value={this.state.selectedUniversityId}
                            onChange={this.handleChange}
                        >
                            <option value="-1">V??lasszon egy egyetemet...</option>
                            {this.props.universities !== "" && this.props.universities.map(uni =>
                                <option value={uni.id}>{uni.name}</option>
                            )}
                        </Form.Control>
                        <Form.Text>Ez a m??velet nem vonhat?? vissza ??s az ??sszes tant??rgyat is t??rli!</Form.Text>
                    </Form.Group>
                    <Button type="submit" variant="danger">T??rl??s</Button>
                </Form>
            </div>
        );
    }
}

export default DeleteUniversity;