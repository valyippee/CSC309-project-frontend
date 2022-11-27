import React from 'react'
import './Navbar.css'

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';


// Navbar from https://react-bootstrap.github.io/components/navbar/#offcanvas

// TODO Links (replace hrefs)

function Header() {
  return (
    <>
        <Navbar bg="light" expand='lg' className="mb-3 navbar">
            <Container fluid>
            <Navbar.Brand href="/"><img className="logo-image" src="https://www.cs.toronto.edu/~kianoosh/courses/csc309/resources/images/tfc.png"></img></Navbar.Brand>

            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-$'md'`} />

            <Navbar.Offcanvas id={`offcanvasNavbar-expand-$'md'`} aria-labelledby={`offcanvasNavbarLabel-expand-$'md'`} placement="end">

                <Offcanvas.Body>

                <Form className="d-flex">
                    <Form.Control type="search" placeholder="Search Studios" className="me-2 search-bar" aria-label="Search"/>
                    <Button variant="secondary">Search</Button>
                </Form>

                <Nav className="navbar-items flex-grow-1 pe-3">
                    <Nav.Link className="nav-item" href="#action1">Studios</Nav.Link>
                    <Nav.Link className="nav-item" href="#action2">Subscriptions</Nav.Link>

                    <NavDropdown className="account-dropdown" title="Account">
                    <NavDropdown.Item href="#action3">Login</NavDropdown.Item>
                    <NavDropdown.Item href="#action4">Register</NavDropdown.Item>
                    </NavDropdown>

                    {/* <NavDropdown className="account-dropdown" title="Account">
                    <NavDropdown.Item href="#action3">Profile</NavDropdown.Item>
                    <NavDropdown.Item href="#action4">My classes</NavDropdown.Item>
                    <NavDropdown.Item href="#action4">Manage Subscriptions</NavDropdown.Item>
                    <NavDropdown.Item href="#action4">Manage Payments</NavDropdown.Item>
                    <NavDropdown.Item href="#action4">My Card</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action5">Logout</NavDropdown.Item>
                    </NavDropdown> */}

                </Nav>

                </Offcanvas.Body>

            </Navbar.Offcanvas>
            </Container>
        </Navbar>
    </>
  );
}

export default Header;