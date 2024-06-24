// console.log("js")
let currentSong = new Audio()
let songs;


function convertSecondsToMinutes(seconds) {

    if (isNaN(seconds) || (seconds < 0)) {
        return "00:00"
    }
    const totalSeconds = Math.floor(seconds);
    
    // Calculate minutes and remaining seconds
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    
    // Pad with zeroes if necessary
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(remainingSeconds).padStart(2, '0');
    
    // Return the formatted time string
    return `${paddedMinutes}:${paddedSeconds}`;
}

async function getSongs(){
    let a = await fetch("http://127.0.0.1:63817/songs/")
    let response = await a.text()
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    let songs = []

    for (let index = 0; index < as.length; index++){
        const element = as[index]
        if (element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

const playMusic = (track, pause=false) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src = "/songs/" + track
    currentSong.play()
    if (!pause){
        currentSong.play()
        play.src = "pause.svg"
    }
    // play.src = "pause.svg"

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = ("00:00 / 00:00")
}

async function main(){
    songs = await getSongs()
    // console.log(songs)
    currentSong.src = songs[0]
    playMusic(songs[0], true)

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + 
        `<li> 
            <img class = "invert" src="music.svg">
            <div class="info">
                <div class = "flex">${song.replaceAll("%20", " ")} </div>
                <div class = "flex">Arnav</div>
            </div>
            <div class="playnow">
                <img src = "pla.svg">
            </div>
        
        </li>`
    }

    // var audio = new Audio(songs[0])
    // audio.play()

    // audio.addEventListener("loadeddata", () => {
    //     console.log(audio.duration, audio.currentSrc, audio.currentTime)
    // });

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })            
    })

    play.addEventListener("click", ()=>{
        if (currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "pla.svg"
        }
    })

    currentSong.addEventListener("timeupdate", ()=>{
        console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutes(currentSong.currentTime)}/${convertSecondsToMinutes(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    document.querySelector(".seekbar").addEventListener("click", e =>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    document.querySelector(".hamburger").addEventListener("click", e => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".cross").addEventListener("click", e => {
        document.querySelector(".left").style.left = "-100%"
    })

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if ((index - 1) >= 0){
            playMusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })
    
}

main()