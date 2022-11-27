import {React, useContext, useState, useEffect} from 'react'
import './Navbar.css'

import AuthContext from '../api/AuthContext'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { getAvatar } from '../api/requests';


// Navbar from https://react-bootstrap.github.io/components/navbar/#offcanvas

// TODO replace hrefs

function Header() {

    let {token, logout} = useContext(AuthContext)

    let [avatar, setAvatar] = useState()

    useEffect(() => {
        getAvatar(setAvatar, token)
    }, [token])


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

                        {token && 
                            <NavDropdown className="account-dropdown" title={
                                <img src={avatar} className="avatar" alt="Avatar"></img>
                            }>
                            <NavDropdown.Item href="/accounts/">Profile</NavDropdown.Item>
                            <NavDropdown.Item href="#action4">My classes</NavDropdown.Item>
                            <NavDropdown.Item href="#action4">Manage Subscriptions</NavDropdown.Item>
                            <NavDropdown.Item href="#action4">Manage Payments</NavDropdown.Item>
                            <NavDropdown.Item href="#action4">My Card</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        }

                        {! token &&
                            <NavDropdown className="account-dropdown" title={
                                <img src={require("../images/default.png")} className="avatar" alt="Avatar"></img>
                            }>
                            <NavDropdown.Item href="/login">Login</NavDropdown.Item>
                            <NavDropdown.Item href="/register">Register</NavDropdown.Item>
                            </NavDropdown>
                        }

                    </Nav>

                    </Offcanvas.Body>

                </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </>
    );
}

export default Header;