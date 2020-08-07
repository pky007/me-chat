// import * as uuid from 'uuid/v4';
const express = require("express")
const app = express()
const server = require('http').Server(app)
const io = require("socket.io")(server)
const uuid = require("uuid").v4
const { ExpressPeerServer } = require('peer');

const peerServer = ExpressPeerServer(server, {
    debug: true,
  });
   




app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use('/peerjs', peerServer)

app.get('/', (req, res) => {
    res.redirect(`/${uuid()}`)
})

app.get('/:room', (req, res) => {
    res.render("room", { roomId: req.params.room })
})

io.on('connection', socket =>{
    console.log("socket connected")
    socket.on('join-room',(roomId, userId)=>{       
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId)

        socket.on('message', message =>{
            io.to(roomId).emit('createMessage', message)
        })


    })
    
})

const PORT = process.env.PORT || 3050


server.listen(PORT)