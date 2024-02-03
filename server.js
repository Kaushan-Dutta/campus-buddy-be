const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require("socket.io");
const { graphqlHTTP } = require('express-graphql');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: true,
});
require('dotenv').config();

app.use(express.static('public'));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/graphql', graphqlHTTP({
  schema: require('./Schema/schema.js'),
  graphiql: true,
}));
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to campus-buddy' });
});
const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

const port = process.env.PORT || 8080;

io.on("connection", (socket) => {
    console.log(`Socket Connected`, socket.id);
    socket.on("room:join", (data) => {
      const { email, room } = data;
      emailToSocketIdMap.set(email, socket.id);
      socketidToEmailMap.set(socket.id, email);
      io.to(room).emit("user:joined", { email, id: socket.id });
      socket.join(room);
      io.to(socket.id).emit("room:join", data);
    });
  
    socket.on("user:call", ({ to, offer }) => {
      io.to(to).emit("incomming:call", { from: socket.id, offer });
    });
  
    socket.on("call:accepted", ({ to, ans }) => {
      io.to(to).emit("call:accepted", { from: socket.id, ans });
    });
  
    socket.on("peer:nego:needed", ({ to, offer }) => {
      console.log("peer:nego:needed", offer);
      io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    });
  
    socket.on("peer:nego:done", ({ to, ans }) => {
      console.log("peer:nego:done", ans);
      io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    });
});
  
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
