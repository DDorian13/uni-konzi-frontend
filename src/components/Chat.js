import React, {Component} from "react";
import {Form, Button} from "react-bootstrap";
import GlobalValues from "../global/GlobalValues";
import decodeJWT from "jwt-decode";

let stompClient = null;
let currentUser = null;

class Chat extends Component {
    constructor() {
        super();
        this.state = {
            message: ""
        }
    }

    userId = "60441180bbcb8a69fdfd5b3a";

    componentDidMount() {
        this.connect();
        currentUser = decodeJWT(localStorage.getItem(GlobalValues.tokenStorageName)).sub;
    }

    connect = () => {
        const Stomp = require("stompjs");
        let SockJS = require("sockjs-client");
        SockJS = new SockJS("http://localhost:8080/ws");
        stompClient = Stomp.over(SockJS);
        stompClient.connect({}, this.onConnected, this.onError);
    }

    onError = (err) => {
        console.log(err);
    }

    onConnected = () => {
        console.log("connected");
        console.log(currentUser);
        stompClient.subscribe(
          "/user/" + this.userId + "/queue/messages",
            this.onMessageReceived
        );
    }

    onMessageReceived = (message) => {

    }

    loadContact = () => {
        fetch(GlobalValues.serverURL + "/users?page=1&limit=99999999", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem(GlobalValues.tokenStorageName)
            }
        }).then(response => {
            if (!response.ok) {
                throw Error("Hiba");
            }
            return response.json();
        }).then(response => {

        }).catch(error => console.log(error.message));
    }

    sendMessage = (messageText) => {
        if (messageText.trim() !== "") {
            const message = {
                senderId: "60441180bbcb8a69fdfd5b3a",
                recipientId: "605139a4d1e36a37354f3637",
                senderName: "First Admin",
                recipientName: "Krisztanoemi",
                message: messageText,
                timestamp: new Date()
            };

            stompClient.send("/app/chat", {}, JSON.stringify(message));
        }
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.sendMessage(this.state.message);
        //this.setState({ message: "" });
    }

    render() {
        return (
            <div className="myFormContainer">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Control
                        type="text"
                        name="message"
                        value={this.state.message}
                        onChange={this.handleChange}
                    />
                    <Button type="submit">Küldés</Button>
                </Form>
            </div>
        );
    }
}

export default Chat;