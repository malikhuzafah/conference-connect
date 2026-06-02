require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const session = require("express-session");
const passport = require("./src/passport");
const { router: authRouter } = require("./src/authRoutes");
const sessionRouter = require("./src/sessionRoutes");
const { registerSocketHandlers } = require("./src/socketHandlers");

const app = express();
const httpServer = http.createServer(app);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
});

app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/api/sessions", sessionRouter);

app.get("/", (req, res) => {
  res.json({ message: "Conference Connect API is running" });
});

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.engine.use(sessionMiddleware);
io.engine.use(passport.initialize());
io.engine.use(passport.session());

registerSocketHandlers(io);

const PORT = 5000;
httpServer.listen(PORT, () => {
  console.log(
    `\nConference Connect backend running on http://localhost:${PORT}`,
  );
  console.log(`Frontend expected at: ${process.env.FRONTEND_URL}\n`);
});
