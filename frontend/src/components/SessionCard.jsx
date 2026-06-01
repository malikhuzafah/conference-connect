import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CATEGORY_VARIANTS = {
  AI: "primary",
  Frontend: "success",
  Backend: "warning",
  Security: "danger",
  Networking: "info",
  DevOps: "secondary",
};

export default function SessionCard({ session, onAdd, onRemove, isScheduled }) {
  const navigate = useNavigate();

  const badgeVariant = CATEGORY_VARIANTS[session.category] || "secondary";
  const formattedTime = new Date(session.scheduledTime).toLocaleString(
    "en-AU",
    {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <Card className="session-card shadow-sm border-0">
      <Card.Header className="d-flex justify-content-between align-items-center bg-white border-bottom">
        <Badge bg={badgeVariant}>{session.category}</Badge>
        <small className="text-muted">{formattedTime}</small>
      </Card.Header>

      <Card.Body className="d-flex flex-column">
        <Card.Title className="h6 mb-1">{session.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted small">
          🎤 {session.speaker} &middot; {session.topic}
        </Card.Subtitle>
        <Card.Text className="small text-secondary flex-grow-1">
          {session.description}
        </Card.Text>

        <div className="d-flex gap-2 mt-auto flex-wrap">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/live/${session.id}`)}
          >
            🔴 Join Live
          </Button>

          {onRemove ? (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onRemove(session.id)}
            >
              Remove
            </Button>
          ) : (
            <Button
              variant={isScheduled ? "success" : "outline-secondary"}
              size="sm"
              onClick={() => !isScheduled && onAdd && onAdd(session)}
              disabled={isScheduled}
            >
              {isScheduled ? "✓ Saved" : "+ My Schedule"}
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
