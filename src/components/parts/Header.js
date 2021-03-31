import React, {Component} from "react";
import GlobalValues from "../../global/GlobalValues";
import {Navbar, Nav, NavDropdown, Form, FormControl, Button} from "react-bootstrap";
import decodeJWT from "jwt-decode";

class Header extends Component {
    constructor() {
        super();
        let token = localStorage.getItem(GlobalValues.tokenStorageName);
        if (token != null) {
            token = decodeJWT(token);
        }
        this.state = {
            token: token,
            searchString: ""
        }
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
        url.pathname = "/universities/search";
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
                        <Nav.Link href="/chat">Üzenetek</Nav.Link>
                        {this.state.token != null && this.state.token.roles.filter(role => role === GlobalValues.adminRole).length > 0 &&
                        <NavDropdown title="Admin" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/universities/new">Egyetem felvétele</NavDropdown.Item>
                            <NavDropdown.Item href="/universities/newsubject">Tantárgy felvétele</NavDropdown.Item>
                            <NavDropdown.Divider/>
                            <NavDropdown.Item href="/users">Felhasználók</NavDropdown.Item>
                        </NavDropdown>}
                        <Form inline onSubmit={this.handleSubmit}>
                            <FormControl
                                type="text"
                                placeholder="Egyetem keresése"
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