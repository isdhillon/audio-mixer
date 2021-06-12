// all the elemets are selected using classes
let playch2=true;
let videoplayer2=document.querySelector(".video-player2");
let playButtonch2 = document.querySelector('.channel2btn');
    let audioContextch2=new AudioContext();
    audioelementch2 = new Audio();
    //drag and drop api
    let dropAreach2=document.querySelector(".dropareach2");
    dropAreach2.addEventListener("dragover", (event)=>{
        event.preventDefault(); 
      });
      //If user leave dragged File from DropArea
      dropAreach2.addEventListener("dragleave", ()=>{
      });
      //If user drop File on DropArea
      dropAreach2.addEventListener("drop", (event)=>{
        playButtonch2.style.display="block";
        event.preventDefault(); 
        //getting user select file and [0] this means if user select multiple files then we'll select only the first one
        file = event.dataTransfer.files[0];
        let filepath=URL.createObjectURL(file);
        audioelementch2.src=filepath 
        videoplayer2.firstChild.remove()
      });
    //web audio api
    let volumech2 = document.querySelector('.volume')
    let gainNodech2 = new GainNode(audioContextch2, { gain: volumech2.value})
    let sourcech2 = audioContextch2.createMediaElementSource(audioelementch2);
    let analyserch2=audioContextch2.createAnalyser();
    sourcech2.connect(analyserch2);
    playButtonch2.addEventListener('click', function() {
        // check if context is in suspended state (autoplay policy)
        drawVisualizer()
        if (audioContextch2.state === 'suspended') {
            audioContextch2.resume();
        }
        // play or pause track depending on state
        else if  (playch2) {
            audioelementch2.play();
            this.dataset.playing = 'true';
            playButtonch2.innerHTML="pause"
            playButtonch2.classList.add("active");
        } else {
            audioelementch2.pause();
            this.dataset.playing = 'false';
            playButtonch2.innerHTML="play_arrow"
            playButtonch2.classList.add("remove");
        }
        playch2=!playch2;
}, false);
audioelementch2.addEventListener('ended', () => {
    playButtonch2.dataset.playing = 'false';}, false);
    
    //adding effects
    let bassch2=document.querySelector(".bass");
    bassch2.addEventListener("input",function(e){
        let val=parseInt(e.target.value);
        bassFilterch2.gain.setTargetAtTime(val,audioContextch2.currentTime,0.1);
    })
    let bassFilterch2=audioContextch2.createBiquadFilter();
    bassFilterch2.type="lowshelf";
    bassFilterch2.frequency=500;
 
    let midch2=document.querySelector(".mid");
    midch2.addEventListener("input",function(e){
        let val=parseInt(e.target.value);
        midFilterch2.gain.setTargetAtTime(val,audioContextch2.currentTime,0.1);
    })
    let midFilterch2=audioContextch2.createBiquadFilter();
    midFilterch2.type="peaking";
    midFilterch2.Q=Math.SQRT1_2;
    midFilterch2.frequency=1500;

  let treblech2=document.querySelector(".treble");
  treblech2.addEventListener("input",function(e){
      let val=parseInt(e.target.value);
      trebleFilterch2.gain.setTargetAtTime(val,audioContextch2.currentTime,0.1);
  })
  let trebleFilterch2=audioContextch2.createBiquadFilter();
  trebleFilterch2.type="highshelf";
  trebleFilterch2.frequency=2000;

  volumech2.addEventListener('input', e => {
      let value = parseFloat(e.target.value)
      gainNodech2.gain.setTargetAtTime(value, audioContextch2.currentTime, .01)
    })
    //connections
analyserch2.connect(gainNodech2);
gainNodech2.connect(bassFilterch2);
bassFilterch2.connect(midFilterch2);
midFilterch2.connect(trebleFilterch2);
trebleFilterch2.connect(audioContextch2.destination);

//canvas api
let canvas=document.querySelector(".canvas2");
function drawVisualizer() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let ctx = canvas.getContext("2d");
    analyserch2.fftSize = 256;
    let bufferLength = analyserch2.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);
    let WIDTH = canvas.width;
    let HEIGHT = canvas.height;
    let barWidth = (WIDTH / bufferLength) * 2.5;
    let barHeight;
    let x = 0;
    function renderFrame() {
      requestAnimationFrame(renderFrame);
      x = 0;
      analyserch2.getByteFrequencyData(dataArray);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        let r = barHeight + (25 * (i/bufferLength));
        let g = 250 * (i/bufferLength);
        let b = 50;
        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    }
    renderFrame();
}
