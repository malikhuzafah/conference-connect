const roomData = new Map();

function getRoom(sessionId) {
  if (!roomData.has(sessionId)) {
    roomData.set(sessionId, {
      participants: new Map(),
      chatHistory: [],
    });
  }
  return roomData.get(sessionId);
}

function getParticipantList(room) {
  return Array.from(room.participants.values());
}

function getActiveRoomSummaries() {
  const summaries = {};
  for (const [sessionId, room] of roomData.entries()) {
    if (room.participants.size > 0) {
      summaries[sessionId] = room.participants.size;
    }
  }
  return summaries;
}

function registerSocketHandlers(io) {
  io.use((socket, next) => {
    const req = socket.request;
    if (req.session && req.session.passport && req.session.passport.user) {
      socket.user = req.session.passport.user;
      return next();
    }
    next(new Error("Unauthorised: please log in to join a session room."));
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} (${socket.user.displayName})`);

    socket.currentRoom = null;

    socket.on("join_room", (sessionId) => {
      if (socket.currentRoom) {
        leaveRoom(socket, io, socket.currentRoom);
      }

      const room = getRoom(sessionId);
      room.participants.set(socket.id, {
        name: socket.user.displayName,
        photo: socket.user.photo,
        id: socket.user.id,
      });

      socket.join(sessionId);
      socket.currentRoom = sessionId;

      socket.emit("chat_history", room.chatHistory);

      io.to(sessionId).emit("user_joined", {
        message: `${socket.user.displayName} joined the session`,
        participants: getParticipantList(room),
      });

      io.emit("active_rooms_update", getActiveRoomSummaries());

      console.log(`${socket.user.displayName} joined room: ${sessionId}`);
    });

    socket.on("send_message", ({ sessionId, message }) => {
      if (!sessionId || !message || !message.trim()) return;

      if (socket.currentRoom !== sessionId) return;

      const room = getRoom(sessionId);
      const chatMessage = {
        sender: socket.user.displayName,
        photo: socket.user.photo,
        message: message.trim(),
        timestamp: new Date().toISOString(),
      };

      room.chatHistory.push(chatMessage);

      io.to(sessionId).emit("receive_message", chatMessage);
    });

    socket.on("leave_room", (sessionId) => {
      leaveRoom(socket, io, sessionId);
    });

    socket.on("disconnect", () => {
      if (socket.currentRoom) {
        leaveRoom(socket, io, socket.currentRoom);
      }
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}

function leaveRoom(socket, io, sessionId) {
  if (!roomData.has(sessionId)) return;

  const room = roomData.get(sessionId);
  room.participants.delete(socket.id);
  socket.leave(sessionId);

  io.to(sessionId).emit("user_left", {
    message: `${socket.user.displayName} left the session`,
    participants: getParticipantList(room),
  });

  socket.currentRoom = null;

  io.emit("active_rooms_update", getActiveRoomSummaries());

  if (room.participants.size === 0) {
    roomData.delete(sessionId);
  }
}

module.exports = { registerSocketHandlers, getActiveRoomSummaries };
