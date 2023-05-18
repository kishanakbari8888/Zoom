const { Socket } = require("engine.io");
const express = require("express");
const {v4:uuidv4} = require("uuid");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const {ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(server,{
    debug:true
});


app.use('/peerjs',peerServer);
app.set('view engine','ejs');
app.use(express.static('public'));


app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room});
})



io.on('connection',(socket) =>{
    console.log("Connected");
    socket.on('join-room',(roomid,useid)=>{
        console.log(roomid);
        console.log(useid);
        socket.to(roomid).emit('user-connected');
        socket.join(roomid);
    });


    socket.on('disconnect',()=>{
        console.log("Disconnected");
    });
})



server.listen(3000,()=>{
    console.log("Server is listen on 4000");
})




