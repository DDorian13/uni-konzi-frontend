import React, {Component} from "react";
import {Form, Button, Table, Alert} from "react-bootstrap";
import TableList from "./parts/TableList";
import GlobalValues from "../global/GlobalValues";

class SubjectComment extends Component {
    constructor(props) {
        super(props);
        const { _currentPage, _perPage } = this.getSearchQueries();
        this.state = {
            response: [],
            isLoading: true,
            currentPage: _currentPage,
            perPage: _perPage,
            comment: "",
            subscriptionSuccess: ""
        };
    }

    getSearchQueries = () => new TableList().getSearchQueries()

    componentDidMount() {
        this.setState({
            isLoading: true
        });

        const url = new URL(GlobalValues.serverURL + window.location.pathname + "/comments");
        url.searchParams.set("page", this.state.currentPage);
        url.searchParams.set("limit", this.state.perPage);

        fetch(url.toString(), {
            method: "GET",
            headers: {
                "Authorization": localStorage.getItem(GlobalValues.tokenStorageName),
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (response.status === 401) {
                    alert("Nem vagy bejelentkezve!\nJelentkezz be vagy regisztrálj a továbblépéshez!");
                    throw Error("Unauthorized");
                } else if (!response.ok) {
                    throw Error("Something went wrong");
                }
                return response.json();
            })
            .then(response => {
                this.setState({
                    response: response,
                    isLoading: false
                });
            })
            .catch(error => {
                console.log(error);
                const url = new URL(window.location);
                url.pathname = "/";
                window.location = url.href;
            });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.currentPage !== this.state.currentPage || prevState.perPage !== this.state.perPage) {
            const url = new URL(window.location);
            url.searchParams.set("page", this.state.currentPage)
            url.searchParams.set("limit", this.state.perPage)
            window.location = url.toString();
        }
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if (this.state.comment === "") {
            return;
        }

        const button = document.getElementById("sendButton");
        button.disable = true;

        const body = {
            text: this.state.comment
        }

        this.setState({ comment: "" });

        fetch(GlobalValues.serverURL + window.location.pathname + "/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem(GlobalValues.tokenStorageName)
            },
            body: JSON.stringify(body)
        }).then(response => {
            if (!response.ok) {
                throw Error("Hiba")
            }
            return response.json()
        }).then(response => {
            let newCommentList = this.state.response;
            newCommentList.comments.push(response);
            this.setState({ response: newCommentList, comment: "" });
        }).catch(error => {
            console.log(error)
        })

        button.disable = false;
    }

    handleSubscribe = (event) => {
        let role = "tutors";
        if (event.target.id === "needHelp") {
            role = "pupils";
        }

        const timer = setInterval(() => this.setState({ subscriptionSuccess: "" },
            () => clearInterval(timer)), 5000);

        fetch(GlobalValues.serverURL + window.location.pathname + `/${role}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem(GlobalValues.tokenStorageName)
            }
        }).then(response => response.json())
            .then(response => {
                console.log(response);
                this.setState({ subscriptionSuccess: "Sikeres művelet!"}, () => timer);
            })
            .catch(error =>  {
                console.log(error)
                this.setState({ subscriptionSuccess: "Sikertelen művelet!"}, () => timer);
            });
    }

    render() {
        return (
                <div className="commentContainer">
                    <div className="commentList">
                        <h2 className="subjectName">{this.state.response.name}</h2>
                        {this.state.isLoading ?
                            "Loading..."
                            :
                            <Table striped bordered hover>
                                <tbody style={{cursor: "text", overflowY: "auto", maxHeight: "70%"}}>
                                    {this.state.response.comments.map(comment => {
                                        return (
                                            <tr>
                                                <td>
                                                    <b>{comment.user.name}</b>
                                                    <br/>
                                                    <span>{comment.text}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        }
                        <Form style={{display: "flex", flexFlow: "row", marginBottom: "1em"}} onSubmit={this.handleSubmit}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="comment"
                                value={this.state.comment}
                                placeholder="Hozzászólás..."
                                onChange={this.handleChange}
                                style={{resize: "none"}}
                                onKeyPress={(event) => {
                                    if (event.key === "Enter" && !event.shiftKey) {
                                        event.preventDefault();
                                        document.getElementById("sendButton").click();
                                    }
                                }}
                            />
                            <Button
                                id={"sendButton"}
                                type="submit"
                                variant="info"
                                style={{width: "6em"}}
                            >
                                Küldés
                            </Button>
                        </Form>
                    </div>
                    <div className="subscribeButtons">
                        <Button id="canHelp" variant="info" onClick={this.handleSubscribe}>Konzultációt tudok tartani</Button>
                        <Button id="needHelp" variant="info" onClick={this.handleSubscribe}>Konzultációt kérek</Button>
                        {this.state.subscriptionSuccess && <Alert variant={this.state.subscriptionSuccess === "Sikeres művelet!" ? "success" : "danger"}>
                            {this.state.subscriptionSuccess}
                        </Alert>}
                    </div>
                </div>
        );
    }
}

export default SubjectComment;