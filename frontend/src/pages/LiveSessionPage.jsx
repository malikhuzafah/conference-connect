import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Form,
  InputGroup,
  Badge,
  ListGroup,
  Image,
  Spinner,
} from "react-bootstrap";
import { io } from "socket.io-client";
import AppNavbar from "../components/AppNavbar";
import { useAuth } from "../context/AuthContext";

const SESSION_TITLES = {
  "session-1": "The Future of Generative AI in Enterprise",
  "session-2": "Building Scalable Microservices with Node.js",
  "session-3": "React 19: What's New and What It Means for You",
  "session-4": "Zero Trust Security in Cloud-Native Applications",
  "session-5": "WebSockets vs Server-Sent Events: Choosing Real-Time",
  "session-6": "DevOps Culture: From Chaos to Continuous Delivery",
};

export default function LiveSessionPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("join_room", sessionId);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("chat_history", (history) => {
      const systemMsg = {
        type: "system",
        message: `You joined the session. ${history.length} previous message${history.length !== 1 ? "s" : ""} loaded.`,
      };
      setMessages([systemMsg, ...history]);
    });

    socket.on("user_joined", ({ message, participants }) => {
      setParticipants(participants);
      setMessages((prev) => [...prev, { type: "system", message }]);
    });

    socket.on("user_left", ({ message, participants }) => {
      setParticipants(participants);
      setMessages((prev) => [...prev, { type: "system", message }]);
    });

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit("leave_room", sessionId);
      socket.disconnect();
    };
  }, [sessionId]);

  const handleSend = () => {
    if (!inputMessage.trim() || !socketRef.current) return;
    socketRef.current.emit("send_message", {
      sessionId,
      message: inputMessage,
    });
    setInputMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const sessionTitle = SESSION_TITLES[sessionId] || `Session ${sessionId}`;

  return (
    <>
      <AppNavbar />
      <div style={{ background: "#f0f2f5", padding: "0.75rem 1rem" }}>
        <div className="d-flex align-items-center gap-3">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => navigate("/dashboard")}
          >
            ← Back
          </Button>
          <div>
            <h6 className="mb-0 fw-bold">{sessionTitle}</h6>
            <small className="text-muted">
              {connected ? (
                <span className="text-success">● Connected</span>
              ) : (
                <span className="text-danger">
                  <Spinner size="sm" animation="border" /> Connecting...
                </span>
              )}
            </small>
          </div>
          <Badge bg="primary" className="ms-auto">
            👥 {participants.length} participant
            {participants.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </div>

      <div className="live-room-container">
        <div className="chat-panel">
          <div className="chat-messages">
            {messages.map((msg, i) =>
              msg.type === "system" ? (
                <div key={i} className="chat-message system">
                  {msg.message}
                </div>
              ) : (
                <div key={i} className="chat-message">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    {msg.photo && (
                      <Image
                        src={msg.photo}
                        roundedCircle
                        width={22}
                        height={22}
                      />
                    )}
                    <span className="sender">{msg.sender}</span>
                    <span className="timestamp">
                      {new Date(msg.timestamp).toLocaleTimeString("en-AU", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div>{msg.message}</div>
                </div>
              ),
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <InputGroup>
              <Form.Control
                placeholder="Type a message and press Enter..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!connected}
              />
              <Button
                variant="primary"
                onClick={handleSend}
                disabled={!connected || !inputMessage.trim()}
              >
                Send
              </Button>
            </InputGroup>
          </div>
        </div>

        <div className="participants-panel d-none d-md-block">
          <h6 className="fw-bold mb-3 border-bottom pb-2">
            Participants ({participants.length})
          </h6>
          <ListGroup variant="flush">
            {participants.map((p, i) => (
              <ListGroup.Item
                key={i}
                className="px-0 py-2 d-flex align-items-center gap-2"
              >
                {p.photo ? (
                  <Image src={p.photo} roundedCircle width={28} height={28} />
                ) : (
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                    style={{ width: 28, height: 28, fontSize: "0.75rem" }}
                  >
                    {p.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="small">
                  {p.name}
                  {p.id === user?.id && (
                    <span className="text-muted ms-1">(you)</span>
                  )}
                </span>
              </ListGroup.Item>
            ))}
            {participants.length === 0 && (
              <ListGroup.Item className="px-0 text-muted small">
                No one here yet...
              </ListGroup.Item>
            )}
          </ListGroup>
        </div>
      </div>
    </>
  );
}
