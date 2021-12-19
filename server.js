var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var server = app.listen(3000, () => {
  console.log(`Listening on port ${server.address().port}`);
});
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
io.on("connection", () => {
  console.log("a user is connected");
});
mongoose
  .connect("mongodb://localhost/chatapp")
  .then(() => console.log("Connected to mongodb"))
  .catch((err) => console.error("couldnt connect to mongodb", err));

var MessageSchema = new mongoose.Schema({
  name: String,
  message: String,
});

const Message = mongoose.model("Message", MessageSchema);

app.get("/messages", (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});

app.post("/messages", (req, res) => {
  var message = new Message(req.body);
  message.save((err) => {
    if (err) sendStatus(500);
    io.emit("message", req.body);
    res.sendStatus(200);
  });
});
