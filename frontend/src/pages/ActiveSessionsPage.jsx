import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import AppNavbar from "../components/AppNavbar";

const ALL_SESSIONS = [
  { id: "session-1", title: "The Future of Generative AI in Enterprise" },
  { id: "session-2", title: "Building Scalable Microservices with Node.js" },
  { id: "session-3", title: "React 19: What's New and What It Means for You" },
  {
    id: "session-4",
    title: "Zero Trust Security in Cloud-Native Applications",
  },
  {
    id: "session-5",
    title: "WebSockets vs Server-Sent Events: Choosing Real-Time",
  },
  {
    id: "session-6",
    title: "DevOps Culture: From Chaos to Continuous Delivery",
  },
];

export default function ActiveSessionsPage() {
  const navigate = useNavigate();
  const [activeRooms, setActiveRooms] = useState({});

  useEffect(() => {
    const socket = io("http://localhost:5000", { withCredentials: true });

    socket.on("active_rooms_update", (roomSummaries) => {
      setActiveRooms(roomSummaries);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const activeSessions = ALL_SESSIONS.filter((s) => activeRooms[s.id] > 0);

  return (
    <>
      <AppNavbar />
      <Container className="py-4">
        <div className="mb-4">
          <h3 className="fw-bold">
            Active Sessions{" "}
            <Badge bg="danger" className="live-badge fs-6">
              LIVE
            </Badge>
          </h3>
          <p className="text-muted">
            Rooms with active participants. Counts update in real time.
          </p>
        </div>

        {activeSessions.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div style={{ fontSize: "3rem" }}>🎙️</div>
            <h5 className="mt-2">No active sessions right now</h5>
            <p>Join a session from the Dashboard to start one!</p>
            <Button variant="primary" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        ) : (
          <Row xs={1} sm={2} lg={3} className="g-4">
            {activeSessions.map((session) => (
              <Col key={session.id}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Badge bg="danger" className="live-badge">
                        LIVE
                      </Badge>
                      <Badge bg="secondary">
                        👥 {activeRooms[session.id]} participant
                        {activeRooms[session.id] !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                    <Card.Title className="h6 flex-grow-1">
                      {session.title}
                    </Card.Title>
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-2"
                      onClick={() => navigate(`/live/${session.id}`)}
                    >
                      Join Room
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
}
