const socket = io('/');
const peer = new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'3000'
});
let myVideoStream;


const videogrid = document.getElementById('video-grid');
const videoElement = document.createElement('video');


peer.on('open',(id)=>{
    socket.emit('join-room',ROOM_ID,id);
});


videoElement.autoplay = true;
videogrid.appendChild(videoElement);


const addVideoStream = (video,stream) =>{
    video.autoplay = true;
    video.srcObject = stream;
    videogrid.appendChild(video);
};


// var constraints = { audio: true, video: true, options: { mirror: true} };
navigator.mediaDevices.getUserMedia({ video: true,audio:true}).then((stream) => {
    videoElement.srcObject = stream;
    myVideoStream = stream;

    
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

socket.on('createMessage',(message)=>{
    console.log("create,asg ",message);
    $('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`);
    scrollToBottom();
});

let msg = $('input');
console.log(msg);

$('html').keydown((e)=>{
    if(e.which == 13 && msg.val().length !== 0){
        console.log(msg.val());
        socket.emit('message',msg.val());
        msg.val('');
    }
});

const scrollToBottom = () =>{
    let d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}

const muteUnmute = () =>{
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }else{
        setMuteButton(); 
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () =>{
    const html = `
        <i class="fas fa-microphone"></i>
        <span>Mute</span>
    `;
    document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () =>{
    const html = `
        <i class="unmute fas fa-microphone-slash"></i>
        <span>Unmute</span>
    `;
    document.querySelector('.main__mute_button').innerHTML = html;
}

const playStop = () =>{
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    }else{
        setStopVideo(); 
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setStopVideo = () =>{
    const html = `
        <i class="fas fa-video"></i>
        <span>Stop Video</span>
    `;
    document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () =>{
    const html = `
        <i class="stop fas fa-video-slash"></i>
        <span>Play Video</span>
    `;
    document.querySelector('.main__video_button').innerHTML = html;
}