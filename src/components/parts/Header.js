import React, {Component} from "react";
import GlobalValues from "../../global/GlobalValues";
import {Navbar, Nav, NavDropdown, Form, FormControl, Button} from "react-bootstrap";

function Header() {
    const handleLogout = (event) => {
        event.preventDefault();
        if (localStorage.getItem(GlobalValues.tokenStorageName) != null) {
            localStorage.removeItem(GlobalValues.tokenStorageName);
            localStorage.removeItem(GlobalValues.userName);
        }
        window.location.href = "/";
    };

        return (
            <Navbar expand="none" className="header">
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#link">Link</Nav.Link>
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider/>
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                        <Form inline>
                            <FormControl type="text" placeholder="Search" className="mr-sm-2"/>
                            <Button variant="outline-success" className="headerSearch">Search</Button>
                        </Form>
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Text style={{color: "black", fontWeight: "bold"}}>
                    Uni Konzi
                </Navbar.Text>
                <NavDropdown
                    className="loginName"
                    title={localStorage.getItem(GlobalValues.userName)}
                >
                    <NavDropdown.Item onClick={handleLogout}>
                        Kijelentkezés
                    </NavDropdown.Item>
                </NavDropdown>
            </Navbar>
        );
}

export default Header;