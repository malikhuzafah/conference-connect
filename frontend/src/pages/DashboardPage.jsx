import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import AppNavbar from "../components/AppNavbar";
import SessionCard from "../components/SessionCard";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { API } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [schedule, setSchedule] = useState(() => {
    const saved = localStorage.getItem("mySchedule");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get("/api/sessions")
      .then((res) => setSessions(res.data))
      .catch(() =>
        setError("Failed to load sessions. Please refresh the page."),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (session) => {
    const updated = [...schedule, session];
    setSchedule(updated);
    localStorage.setItem("mySchedule", JSON.stringify(updated));
  };

  const scheduledIds = new Set(schedule.map((s) => s.id));

  if (loading) {
    return (
      <>
        <AppNavbar />
        <div className="loading-overlay">
          <Spinner animation="border" variant="primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <AppNavbar />
      <Container className="py-4">
        <div className="mb-4">
          <h3 className="fw-bold">Conference Sessions</h3>
          <p className="text-muted">
            Browse and join live sessions or save them to your schedule.
          </p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Row xs={1} sm={2} lg={3} className="g-4">
          {sessions.map((session) => (
            <Col key={session.id}>
              <SessionCard
                session={session}
                onAdd={handleAdd}
                isScheduled={scheduledIds.has(session.id)}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}
