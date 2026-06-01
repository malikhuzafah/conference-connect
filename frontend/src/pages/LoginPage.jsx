import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { user, loading, loginWithLinkedIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const authError = searchParams.get("error");

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      }}
    >
      <Container style={{ maxWidth: 420 }}>
        <Card className="shadow-lg border-0 rounded-4 p-2">
          <Card.Body className="text-center p-4">
            <div className="mb-3" style={{ fontSize: "3rem" }}>
              🎙️
            </div>
            <h2 className="fw-bold mb-1">Conference Connect</h2>
            <p className="text-muted mb-4">
              Real-time conference engagement platform
            </p>

            {authError === "auth_failed" && (
              <Alert variant="danger" className="mb-3">
                Authentication failed. Please try again.
              </Alert>
            )}

            <Button
              className="btn-linkedin w-100 py-2 mb-3 d-flex align-items-center justify-content-center gap-2"
              onClick={loginWithLinkedIn}
              size="lg"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              Sign in with LinkedIn
            </Button>

            <p className="text-muted small mt-3 mb-0">
              Your LinkedIn profile will be used to personalise your experience.
              <br />
              We do not post anything on your behalf.
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
