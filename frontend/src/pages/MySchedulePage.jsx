import React, { useState } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import AppNavbar from "../components/AppNavbar";
import SessionCard from "../components/SessionCard";

export default function MySchedulePage() {
  const [schedule, setSchedule] = useState(() => {
    const saved = localStorage.getItem("mySchedule");
    return saved ? JSON.parse(saved) : [];
  });

  const handleRemove = (sessionId) => {
    const updated = schedule.filter((s) => s.id !== sessionId);
    setSchedule(updated);
    localStorage.setItem("mySchedule", JSON.stringify(updated));
  };

  return (
    <>
      <AppNavbar />
      <Container className="py-4">
        <div className="mb-4">
          <h3 className="fw-bold">My Schedule</h3>
          <p className="text-muted">
            {schedule.length} session{schedule.length !== 1 ? "s" : ""} saved
          </p>
        </div>

        {schedule.length === 0 ? (
          <Alert variant="info">
            You haven't saved any sessions yet. Head to the{" "}
            <a href="/dashboard">Dashboard</a> to browse sessions.
          </Alert>
        ) : (
          <Row xs={1} sm={2} lg={3} className="g-4">
            {schedule.map((session) => (
              <Col key={session.id}>
                <SessionCard session={session} onRemove={handleRemove} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
}
