//most of the elements are selected usig ids
let playch1=true;
let videoplayer1=document.querySelector(".video-player1");
let playButtonch1 = document.querySelector('.channel1btn');
    let audioContextch1=new AudioContext();
    audioelementch1 = new Audio();
    let dropAreach1=document.querySelector(".dropareach1");
    //drag and drop api
    dropAreach1.addEventListener("dragover", (event)=>{
        event.preventDefault(); 
      });
      //If user leave dragged File from DropArea
      dropAreach1.addEventListener("dragleave", ()=>{
      });
      //If user drop File on DropArea
      dropAreach1.addEventListener("drop", (event)=>{
        playButtonch1.style.display="block";
        event.preventDefault(); 
        //getting user select file and [0] this means if user select multiple files then we'll select only the first one
        file = event.dataTransfer.files[0];
        let filepath=URL.createObjectURL(file);
        audioelementch1.src=filepath 
        videoplayer1.firstChild.remove()
      });
    //web audio api
    let volumech1 = document.getElementById('volume')
    let gainNodech1 = new GainNode(audioContextch1, { gain: volumech1.value})
    let sourcech1 = audioContextch1.createMediaElementSource(audioelementch1);
    let analyserch1=audioContextch1.createAnalyser();
    sourcech1.connect(analyserch1);
    playButtonch1.addEventListener('click', function() {
    // check if context is in suspended state (autoplay policy)
    //calling the visualizer function canvas api
        drawVisualizer1()
    if (audioContextch1.state === 'suspended') {
        audioContextch1.resume();
    }
    // play or pause track depending on state
    else if  (playch1) {
        audioelementch1.play();
        this.dataset.playing = 'true';
        playButtonch1.innerHTML="pause"
        playButtonch1.classList.add("active");
    } else {
        audioelementch1.pause();
        this.dataset.playing = 'false';
        playButtonch1.innerHTML="play_arrow"
        playButtonch1.classList.add("remove");
    }
    playch1=!playch1;
    
}, false);
audioelementch1.addEventListener('ended', () => {
    playButtonch1.dataset.playing = 'false';}, false);

    //Adding effects on the audio
    let bassch1=document.getElementById("bass");
    bassch1.addEventListener("input",function(e){
        let val=parseInt(e.target.value);
        bassFilterch1.gain.setTargetAtTime(val,audioContextch1.currentTime,0.1);
    })
    let bassFilterch1=audioContextch1.createBiquadFilter();
    bassFilterch1.type="lowshelf";
    bassFilterch1.frequency=500;

    let midch1=document.getElementById("mid");
    midch1.addEventListener("input",function(e){
        let val=parseInt(e.target.value);
        midFilterch1.gain.setTargetAtTime(val,audioContextch1.currentTime,0.1);
    })
    let midFilterch1=audioContextch1.createBiquadFilter();
    midFilterch1.type="peaking";
    midFilterch1.Q=Math.SQRT1_2;
    midFilterch1.frequency=1500;

    let treblech1=document.getElementById("treble");
    treblech1.addEventListener("input",function(e){
        let val=parseInt(e.target.value);
        trebleFilterch1.gain.setTargetAtTime(val,audioContextch1.currentTime,0.1);
    })
    let trebleFilterch1=audioContextch1.createBiquadFilter();
    trebleFilterch1.type="highshelf";
    trebleFilterch1.frequency=2000;

    volumech1.addEventListener('input', e => {
        let value = parseFloat(e.target.value)
        gainNodech1.gain.setTargetAtTime(value, audioContextch1.currentTime, .01)
    })

    //connections
analyserch1.connect(gainNodech1);
gainNodech1.connect(bassFilterch1);
bassFilterch1.connect(midFilterch1);
midFilterch1.connect(trebleFilterch1);
trebleFilterch1.connect(audioContextch1.destination);

//canvas api code
let visualizerch1=document.querySelector(".canvas1");
function drawVisualizer1() {
    requestAnimationFrame(drawVisualizer1)
    analyserch1.fftSize = 256;
    let bufferLength = analyserch1.frequencyBinCount
    let dataArray = new Uint8Array(bufferLength)
    analyserch1.getByteFrequencyData(dataArray)
    let width = visualizerch1.width
    let height = visualizerch1.height
    let barWidth = (width / bufferLength)*2.5
    
    let canvasContext = visualizerch1.getContext('2d')
    canvasContext.fillStyle = "#000";
    canvasContext.clearRect(0, 0, width, height)
    dataArray.forEach((item, index) => {
        let y = item / 255 * height / 2
        let x = barWidth * index
        
        canvasContext.fillStyle = `hsl(${y / height * 400}, 100%, 50%)`
        canvasContext.fillRect(x, height - y, barWidth, y)
    })
}

//linking the recording page
let recordingicon=document.querySelector(".recordings");
recordingicon.addEventListener("click",function(){
    location.assign("recordings.html");
})