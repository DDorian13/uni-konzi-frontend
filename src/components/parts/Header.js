import React, {Component} from "react";
import GlobalValues from "../../global/GlobalValues";
import {Navbar, Nav, NavDropdown, Form, FormControl, Button} from "react-bootstrap";
import decodeJWT from "jwt-decode";


class Header extends Component {
    constructor() {
        super();
        let token = localStorage.getItem(GlobalValues.tokenStorageName);
        if (token != null) {
            const before_decode = token;
            token = decodeJWT(token);
            this.newMessage(before_decode, token);
        }

        let now = new Date();
        let date = `${now.getFullYear()}-`+
            `${now.getMonth()+1 < 10 ? "0" + (now.getMonth()+1) : (now.getMonth()+1)}-` +
            `${now.getDate() < 10 ? "0" + now.getDate() : now.getDate()}T` +
            `${now.getHours() < 10 ? "0" + now.getHours() : now.getHours()}:` +
            `${now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()}`

        this.state = {
            token: token,
            searchType: "universities",
            searchString: "",
            hasNewMessage: false,
            users: [],

            selectedUserId: "-1",
            selectedDate: date,
            lengthInMinutes: 0,
            description: "",
            location: ""
        }
    }

    newMessage(token, decoded_token) {
        fetch(GlobalValues.serverURL + "/messages/" + decoded_token.userId + "/has-new", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        }).then(response => response.json())
            .then(response => {
                if (response >= 1) {
                    this.setState({ hasNewMessage: true });
                }
            })
            .catch(error => console.log(error));
    }

    handleLogout = (event) => {
        event.preventDefault();
        if (localStorage.getItem(GlobalValues.tokenStorageName) != null) {
            localStorage.removeItem(GlobalValues.tokenStorageName);
        }
        window.location.href = "/";
    };

    handleChange = (event) => {
        const {name, value} = event.target;
        this.setState({[name]: value});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const url = new URL(window.location.origin);
        url.pathname = `/${this.state.searchType}/search`;
        url.searchParams.set("nameLike", this.state.searchString);
        window.location = url;
    }

    showDateReserve = () => {
        fetch(GlobalValues.serverURL + `/messages/${this.state.token.userId}/contacts`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem(GlobalValues.tokenStorageName)
            }
        }).then(response => {
            if (response.status === 401) {
                alert("A továbblépéshez jelentkezz be!");
                throw Error("Unauthorized");
            } else if (!response.ok) {
                throw Error("Hiba");
            }
            return response.json();
        }).then(response => {
                this.setState({users: response});
                document.getElementById("overlayDateReserve").style.display = "flex";
            }
        ).catch(error => {
            console.log(error);
            window.location.pathname = "/";
        });
    }

    handleDateReserve = (event) => {
        event.preventDefault();
        if (this.state.selectedUserId === "-1") {
            return;
        } else if (new Date(this.state.selectedDate) < new Date()) {
            alert("A kiválasztott időpont érvénytelen!");
            return;
        }

        const token = localStorage.getItem(GlobalValues.tokenStorageName);

        const body = {
            creatorId: decodeJWT(token).userId,
            participantId: this.state.selectedUserId,
            date: new Date(this.state.selectedDate),
            length: parseInt(this.state.lengthInMinutes),
            description: this.state.description,
            location: this.state.location
        }

        fetch(GlobalValues.serverURL + "/appointments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(body)
        }).then(response => {
            if (!response.ok)
                throw Error("Hiba");
            return response.json();
        })
            .then(alert("Az időpont sikeresen rögzítve!\nÜzenetek fülön az adott felhasználót kiválasztva le tudja tölteni!"))
            .catch(error => console.log(error));

        this.setState({ selectedUserId: "-1" })
        document.getElementById("overlayDateReserve").style.display = "none";
    }

    render() {
        return (
            <>
            <Navbar expand="none" className="header">
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Kezdőlap</Nav.Link>
                        <Nav.Link href="/universities">Egyetemek</Nav.Link>
                        <Nav.Link href="/chat">
                            Üzenetek
                            {this.state.hasNewMessage && <strong style={{fontSize: "0.9em"}}> -új üzenet-</strong>}
                        </Nav.Link>
                        <NavDropdown id="basic-nav-dropdown-subscriptions" title="Konzultációk">
                            <NavDropdown.Item href="/subjects/tutor-of">Tartok...</NavDropdown.Item>
                            <NavDropdown.Item href="/subjects/pupil-of">Kértem...</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={this.showDateReserve}>Időpont rögzítése...</NavDropdown.Item>
                        </NavDropdown>
                        {this.state.token != null && this.state.token.roles.filter(role => role === GlobalValues.adminRole).length > 0 &&
                        <NavDropdown title="Admin" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/users">Felhasználók</NavDropdown.Item>
                        </NavDropdown>}
                        <Form inline onSubmit={this.handleSubmit}>
                            <FormControl
                                as="select"
                                name="searchType"
                                value={this.state.searchType}
                                className="mr-sm-2"
                                onChange={this.handleChange}
                            >
                                <option value="universities">Egyetem</option>
                                <option value="subjects">Tantárgy</option>
                            </FormControl>
                            <FormControl
                                type="text"
                                placeholder="keresése"
                                className="mr-sm-2"
                                name="searchString"
                                value={this.state.searchString}
                                onChange={this.handleChange}
                            />
                            <Button
                                variant="outline-success"
                                className="headerSearch fa fa-search"
                                type="submit"
                            >
                            </Button>
                        </Form>
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Text className="headerTitle">
                    Uni Konzi
                </Navbar.Text>
                {this.state.token === null ?
                    <div style={{display: "flex", flexFlow: "row", justifyContent: "flex-end"}}>
                        <Button href="/login" variant="outline-info">
                            Bejelentkezés
                        </Button>
                        <Button href="/signup" style={{marginLeft: "0.5em"}} variant="info">
                            Regisztrálás
                        </Button>
                    </div>
                    :
                    <NavDropdown
                        className="loginName"
                        title={this.state.token.sub}
                    >
                        <NavDropdown.Item onClick={this.handleLogout} className="fa fa-sign-out">
                            <span style={{fontFamily: "revert"}}> Kijelentkezés</span>
                        </NavDropdown.Item>
                    </NavDropdown>
                }
            </Navbar>

            <div id="overlayDateReserve">
                <Form className="myForm" onSubmit={this.handleDateReserve}>
                    <Button
                        variant="outline-danger"
                        className="fa fa-close formCloseButton"
                        onClick={() => {
                            document.getElementById("overlayDateReserve").style.display = "none";
                            this.setState({ selectedUserId: "-1" })
                        }}
                    />
                    <Form.Group>
                        <Form.Label>Konzultációs partner</Form.Label>
                        <Form.Control
                            as="select"
                            name="selectedUserId"
                            value={this.state.selectedUserId}
                            onChange={this.handleChange}
                        >
                            <option value="-1">Válasszon egy felhasználót...</option>
                            {this.state.users.map(user => <option value={user.id}>{user.name} - {user.email}</option>)}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Időpont</Form.Label>
                        <Form.Control
                            id="datetime-local"
                            type="datetime-local"
                            required={true}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            name="selectedDate"
                            value={this.state.selectedDate}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Konzultáció időtartama (percben)</Form.Label>
                        <Form.Control
                            required={true}
                            type="number"
                            name="lengthInMinutes"
                            value={this.state.lengthInMinutes}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Leírás</Form.Label>
                        <Form.Control
                            type="text"
                            name="description"
                            value={this.state.description}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Helyszín</Form.Label>
                        <Form.Control
                            type="text"
                            name="location"
                            value={this.state.location}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Button variant="info" type="submit">Időpont rögzítése</Button>
                </Form>
            </div>
            </>
        );
    }
}

export default Header;
