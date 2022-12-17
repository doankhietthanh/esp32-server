const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/", function (req, res) {
  res.send("<h1>Hello world</h1>");
});

// When the server receives a post request on /sendData
app.post("/sendData", function (req, res) {
  //send data to sockets.
  io.sockets.emit("event", { message: "Hello from server!" });

  res.send({});
});

// When a new connection is requested
io.on("connection", function (socket) {
  console.log("User Connected!");
  const timestamp = new Date().getTime();
  socket.emit("timestamp", timestamp);

  // Send to the connected user
  socket.emit("event", { message: "Connected !!!!" });

  socket.on("image", function (data) {
    socket.broadcast.emit("image", data);
    console.log("Client send image!");
  });

  socket.on("message", function (data) {
    console.log("Message received: " + data);
    socket.broadcast.emit("message", data);
  });

  // setInterval(() => {

  //   console.log("timestamp sent");
  // }, 10000);
});

// Listen to port 8080
http.listen(8080, function () {
  console.log("listening on *:8080");
});
