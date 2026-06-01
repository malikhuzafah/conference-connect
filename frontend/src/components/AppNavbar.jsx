import React from "react";
import { Navbar, Nav, Container, Button, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-0 px-2">
      <Container fluid>
        <Navbar.Brand as={Link} to="/dashboard">
          🎙️ Conference Connect
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/my-schedule">
              My Schedule
            </Nav.Link>
            <Nav.Link as={Link} to="/active-sessions">
              Active Sessions
            </Nav.Link>
          </Nav>

          {user && (
            <Nav className="align-items-center gap-2">
              {user.photo && (
                <Image
                  src={user.photo}
                  roundedCircle
                  width={32}
                  height={32}
                  className="border border-secondary"
                  alt={user.displayName}
                />
              )}
              <Navbar.Text className="text-white">
                {user.displayName}
              </Navbar.Text>
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
