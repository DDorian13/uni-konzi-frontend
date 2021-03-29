import React, {Component} from "react";
import {Form, Button, Table} from "react-bootstrap";
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
            comment: ""
        };
    }

    getSearchQueries = () => new TableList().getSearchQueries()

    componentDidMount() {
        this.setState({
            isLoading: true
        });

        const url = new URL(GlobalValues.serverURL + window.location.pathname);
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
                window.history.go(-1);
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

        fetch(GlobalValues.serverURL + window.location.pathname, {
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
            console.log(newCommentList);
            this.setState({ response: newCommentList, comment: "" });
        }).catch(error => {
            console.log(error.message)
        })

        button.disable = false;
    }

    render() {
        return (
                <div className="commentContainer">
                    <div className="list_and_name"  style={{width: "70%"}}>
                        {this.state.isLoading ?
                            "Loading..."
                            :
                            <>
                            <h1 className="subjectName">{this.state.response.name}</h1>
                            <Table striped bordered hover>
                                <tbody style={{cursor: "text"}}>
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
                            </>}
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

                    {/*<div className="subjectButtons">
                        <Button variant="info">Feliratkozás</Button>
                    </div>*/}
                </div>
        );
    }
}

export default SubjectComment;