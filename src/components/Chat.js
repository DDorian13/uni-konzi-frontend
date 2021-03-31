import React, { Component } from "react";
import {Form, Button} from "react-bootstrap";
import GlobalValues from "../global/GlobalValues";
import decodeJWT from "jwt-decode";

let stompClient = null;
let currentUser = null;

class Chat extends Component {
    constructor() {
        super();
        this.state = {
            message: "",
            contacts: [],
            activeContact: undefined,
            messages: []
        }
    }

    componentDidMount() {
        this.connect();
        const token = decodeJWT(localStorage.getItem(GlobalValues.tokenStorageName));
        currentUser = {
            name: token.sub,
            id: token.userId
        };
        this.loadContacts();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.activeContact === this.state.activeContact) return;
        if (this.state.activeContact !== undefined) {
            fetch(GlobalValues.serverURL + `/messages/${this.state.activeContact.id}/${currentUser.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem(GlobalValues.tokenStorageName)
                }
            })
                .then(response => response.json())
                .then(messages => this.setState({ messages: messages }, () => this.scrollToBottom()))
                .catch(error => console.log(error));
            this.loadContacts();
        }
    }

    componentWillUnmount() {
        stompClient.disconnect();
    }

    connect = () => {
        const Stomp = require("stompjs");
        let SockJS = require("sockjs-client");
        SockJS = new SockJS(`${GlobalValues.serverURL}/ws`);
        stompClient = Stomp.over(SockJS);
        stompClient.connect({}, this.onConnected, this.onError);
    }

    onError = (err) => {
        console.log(err);
    }

    onConnected = () => {
        console.log(currentUser);
        stompClient.subscribe(
          "/user/" + currentUser.id + "/queue/messages",
            this.onMessageReceived
        );
    }

    onMessageReceived = (message) => {
        const notification = JSON.parse(message.body);
        if (this.state.activeContact && this.state.activeContact.id === notification.senderId) {
            fetch(GlobalValues.serverURL + "/messages/" + notification.id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem(GlobalValues.tokenStorageName)
                }
            })
                .then(response => response.json())
                .then(newMessage => {
                    this.setState(prevState => {
                        const messages = prevState.messages;
                        messages.push(newMessage);
                        return {
                            messages: messages
                        }
                    }, () => this.scrollToBottom())
                })
                .catch(error => console.log(error));
        } else {
            console.log("Received a new message from " + notification.senderName);
        }
        this.loadContacts();
    }

    loadContacts = () => {
        const promise = fetch(GlobalValues.serverURL + `/users`, {
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
        }).then(response =>
            response.map(user =>
                this.countNewMessages(user.id, currentUser.id)
                    .then(response => response.json())
                    .then(count => {
                        user.newMessagesCount = count;
                        return user;
                    })
            )
        ).catch(error => console.log(error.message));

        promise.then(promises =>
            Promise.all(promises).then(users => {
                this.setState({ contacts: users });
                if (this.state.activeContact === undefined && users.length > 0) {
                    this.setState({ activeContact: users[0]})
                }
            })
        );
    }

    countNewMessages = (senderId, recipientId) => {
        return fetch(GlobalValues.serverURL + `/messages/${senderId}/${recipientId}/count`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem(GlobalValues.tokenStorageName)
            }
        })
    }

    sendMessage = (messageText) => {
        if (messageText.trim() !== "") {
            const message = {
                senderId: currentUser.id,
                recipientId: this.state.activeContact.id,
                senderName: currentUser.name,
                recipientName: this.state.activeContact.name,
                message: messageText,
                timestamp: new Date()
            };

            stompClient.send("/app/chat", {}, JSON.stringify(message));

            const messages = this.state.messages;
            messages.push(message);
            this.setState({ messages: messages }, () => this.scrollToBottom());
        }
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.sendMessage(this.state.message);
        this.setState({ message: "" });
    }

    scrollToBottom = () => {
        let element = document.getElementById("messageList");
        element.scrollTop = element.scrollHeight;
    }

    render() {
        return (
            <div className="chat">
                <div className="allContacts">
                    <p className="activeContactName">Kapcsolatok</p>
                    <ul className="contactList">
                        {this.state.contacts.map(contact =>
                            <li
                                onClick={() => this.setState({
                                    activeContact: contact
                                })}
                                className={this.state.activeContact !== undefined && contact.id === this.state.activeContact.id ?
                                    "contact active"
                                    :
                                    "contact"
                                }
                            >
                                {contact.name}{contact.newMessagesCount > 0 && <p>Új üzenet</p>}
                            </li>
                        )}
                    </ul>
                </div>
                <div className="activeContact">
                    <p className="activeContactName">{this.state.activeContact !== undefined && this.state.activeContact.name}</p>
                    <ul className="messageList" id="messageList">
                        {this.state.messages !== [] && this.state.messages.map(msg =>
                            <li className={msg.senderId === currentUser.id ? "myMessage":"senderMessage"}>
                                {msg.message}
                            </li>
                        )}
                    </ul>
                    <Form onSubmit={this.handleSubmit} className="messageForm">
                        <Form.Control
                            type="text"
                            name="message"
                            value={this.state.message}
                            onChange={this.handleChange}
                        />
                        <Button variant="info" type="submit">Küldés</Button>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Chat;