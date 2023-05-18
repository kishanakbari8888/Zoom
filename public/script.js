const socket = io('/');
const peer = new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'3000'
});


const videogrid = document.getElementById('video-grid');
const videoElement = document.createElement('video');


peer.on('open',(id)=>{
    socket.emit('join-room',roomid,id);
});




videoElement.autoplay = true;
videogrid.appendChild(videoElement);
let st;

navigator.mediaDevices.getUserMedia({ video: true}).then((stream) => {
    videoElement.srcObject = stream;

    socket.on('user-connected',(useid)=>{
        console.log("User Connected");
        const call = peer.call(useid,stream);
        call.on('stream',(userVideoStream)=>{
            addVideoStream(videoElement,userVideoStream);
        });
    });
    
}).catch((error) => {
    console.error('Error accessing camera:', error);
});





