import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("🟢 Nuovo client connesso:", socket.id);
  socket.on("disconnect", () => console.log("🔴 Disconnesso:", socket.id));
});

// Endpoint per ricevere notifiche dal PHP
app.get("/notify", (req, res) => {
  const { table, id, action } = req.query;
  io.emit("update", { table, id, action });
  console.log(`📢 Notifica per tabella: ${table}, record: ${id}, azione: ${action}`);
  res.send("Notifica inviata ✅");
});

// Porta di ascolto
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`✅ Server realtime attivo sulla porta ${PORT}`));
