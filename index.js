const app = require("express")();
const PORT = process.env.PORT || 5000;

const http = require("http")
const server = http.createServer(app);

const cors = require("cors");

const socket = require("socket.io");
const io = socket(server, {
    cors: {
        origin: "*",
        methods:["GET", "POST"]
    }
});

app.use(cors())

app.get("/", (req, res) => {
    res.send("Backend running")
    res.redirect("https://vc-frontend-sm.netlify.app/");
})

io.on("connection", (socket) => {
    socket.emit('me', socket.id)

    socket.on('disconnect', () => {
        socket.broadcast.emit("callended")
    });

    socket.on("calluser", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("calluser", { signal: signalData, from, name})
    })

    socket.on("answercall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal)
    })
})

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});

