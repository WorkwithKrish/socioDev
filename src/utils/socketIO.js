const socketIo = require("socket.io");
const crypto = require("crypto");

const InitializeSocketIO = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const hashedRoomId = (targetUserId, userId) => {
    const hashedRoomId = crypto
      .createHash("sha256")
      .update([targetUserId, userId].sort().join(""))
      .digest("hex");
    return [targetUserId, userId].sort().join("+");
  };

  io.on("connection", (socket) => {
    socket.on("join", ({ targetUserId, userId }) => {
      const room = hashedRoomId(targetUserId, userId);
      socket.join(room);
      console.log("User joined room: " + room);
    });

    socket.on("sendMessage", ({ firstName, lastName, text, to, from }) => {
      const room = hashedRoomId(to, from);
      console.log("Message sent to roompp: " + room);
      io.to(room).emit("receiveMessage", { text, firstName, lastName, from });
    });

    // socket.on("sendMessage", (data) => {
    //   // Save to DB or forward to recipient
    //   io.to(data.to).emit("receiveMessage", data);
    // });

    socket.on("disconnect", () => {});
  });
};

module.exports = { InitializeSocketIO };
