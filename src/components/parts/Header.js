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
        this.state = {
            token: token,
            searchType: "universities",
            searchString: "",
            hasNewMessage: false
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

    render() {
        return (
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
                        </NavDropdown>
                        {this.state.token != null && this.state.token.roles.filter(role => role === GlobalValues.adminRole).length > 0 &&
                        <NavDropdown title="Admin" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/universities/new">Egyetem felvétele</NavDropdown.Item>
                            <NavDropdown.Item href="/universities/newsubject">Tantárgy felvétele</NavDropdown.Item>
                            <NavDropdown.Divider/>
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
        );
    }
}

export default Header;