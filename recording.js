//Declarations
let recordingBtn=document.querySelector(".recording");
let timings = document.querySelector(".timing");
let counter = 0;
let clearObj;
let constraints={audio: true };

//to store the recording
let recording=[];
let isRecording=false;
let userMedia=navigator.mediaDevices.getUserMedia(constraints);
let mediarecordingObjectForCurrStream;

userMedia.then(function(stream){
    //for recording
    mediarecordingObjectForCurrStream= new MediaRecorder(stream);

    //when stream is available on buffer add it to recording
    mediarecordingObjectForCurrStream.addEventListener("dataavailable",function(r){
        recording.push(r.data);
    });

    //when recording stopped
    mediarecordingObjectForCurrStream.addEventListener("stop",function(){
        // recording -> url convert 
        const blob = new Blob(recording, {type : 'audio/webm'});
            addMediaToRecordings(blob, "audio");
        recording = [];
    })
}).catch(function(err){
    console.log(err);
    alert("Please provide necessary microphone permissions.");
})

//recording on/off
recordingBtn.addEventListener("click",function(e){
    if (mediarecordingObjectForCurrStream == undefined) {
        alert("First select the devices");
        return;
    }else if(isRecording){
        mediarecordingObjectForCurrStream.stop();
        stopTimer();
        recordingBtn.classList.remove("record-animation");
    }else{
        mediarecordingObjectForCurrStream.start();
        startTimer();
        recordingBtn.classList.add("record-animation");      
    }
    isRecording=!isRecording;
})
//timer 
function startTimer() {
    timings.style.display = "block";
    function fn() {
        // hours
        let hours = Number.parseInt(counter / 3600);
        let RemSeconds = counter % 3600;
        let mins = Number.parseInt(RemSeconds / 60);
        let seconds = RemSeconds % 60;
        hours = hours < 10 ? `0${hours}` : hours;
        mins = mins < 10 ? `0${mins}` : `${mins}`;
        seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        timings.innerText = `${hours}:${mins}:${seconds}`
        counter++;
    }
    clearObj = setInterval(fn, 1000);
}
function stopTimer() {
    timings.style.display = "none";
    clearInterval(clearObj);
}
