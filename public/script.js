

const socket = io('/')

const videoGrid = document.getElementById("video-grid")
const myVideo = document.createElement('video')
myVideo.muted = true


var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
});

let myVideoStream

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream
    addVideoStream(myVideo, stream)

    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })

    })


    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream)
    })


    let text = $('input')
    $('html').keydown(e => {

        if (e.which == 13 && text.val().length !== 0) {
            socket.emit('message', text.val());
            text.val('')
        }
    })

    socket.on('createMessage', message => {
        $('.messages').append(`<li class="message"><b>user: </b>${message}</li>`)
        //    scrollToBottom()
    })

})

// const scrollToBottom = ()=>{
//     var d = $('.main_chat_window');
//     d.scrollTop(d.prop("scrollHeight"))

// }

const muteUnMute = () => {
  
    const enable = myVideoStream.getAudioTracks()[0].enable
    console.log("call", enable)
    if (enable) {
        myVideoStream.getAudioTracks()[0].enable = false
        setUnMuteButton()
    }
    else {
        setMuteButton()
        myVideoStream.getAudioTracks()[0].enable = true
    }
}


const  setMuteButton = ()=>{
    const html = `
    <i class="fas fa-microphone"></i>
    <span>Unmute</span>`
    document.querySelector('.main_mute_button').innerHeight = html
}




const  setUnMuteButton = ()=>{
    const html = `
    <i class="fas fa-microphone-slash"></i>
    <span>Unmute</span>`
    document.querySelector('.main_mute_button').innerHeight = html
}












peer.on('open', id => {
    socket.emit('join-room', Room_ID, id)
})



const connectToNewUser = (userId, stream) => {
    var call = peer.call(userId, stream);
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })


}


const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play()

    })

    videoGrid.append(video)


}

