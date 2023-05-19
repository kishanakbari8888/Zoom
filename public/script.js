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


const addVideoStream = (video,stream) =>{
    video.srcObject = stream;
    video.autoplay = true;
    videogrid.appendChild(video);
};

navigator.mediaDevices.getUserMedia({ video: true}).then((stream) => {
    videoElement.srcObject = stream;

    peer.on('call',(call)=>{
        call.answer(stream);
        const myvideo = document.createElement('video');
        call.on('stream',(userVideoStream)=>{
            addVideoStream(myvideo,userVideoStream);
        });
    });
 
    socket.on('user-connected',(useid)=>{
        console.log("User Connected");
        const call = peer.call(useid,stream);
        const uservideo = document.createElement('video');
        call.on('stream',(userVideoStream)=>{
            addVideoStream(uservideo,userVideoStream);
        });
    });
    
}).catch((error) => {
    console.error('Error accessing camera:', error);
});





