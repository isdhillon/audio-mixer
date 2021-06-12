let request = indexedDB.open("recordings", 1);
let db;
request.onsuccess = function (e) {
  db = request.result;
};
request.onerror = function (e) {
  console.log("error");
};
request.onupgradeneeded = function (e) {
  db = request.result;
  db.createObjectStore("recordings", { keyPath: "mId" });
};
//add audio from recordings
function addMediaToRecordings(data, type) {
    let tx = db.transaction("recordings", "readwrite");
    let recordings = tx.objectStore("recordings");
    recordings.add({ mId: Date.now(), type, media: data });
  }
  //view stored recordings
  function viewRecording() {
    let gbody = document.querySelector(".recordings");
    let tx = db.transaction("recordings", "readonly");
    let recordings = tx.objectStore("recordings");
    let req = recordings.openCursor();
    req.onsuccess = function (e) {
      let cursor = req.result;
      if (cursor) {
        if (cursor.value.type == "audio") {
          let audioContainer = document.createElement("div");
          audioContainer.setAttribute("data-mId", cursor.value.mId);
          audioContainer.classList.add("recordings-aud-container");
          let audio = document.createElement("audio");
          audioContainer.appendChild(audio);
  
          let deleteBtn = document.createElement("button");
          deleteBtn.classList.add("recordings-delete-button");
          deleteBtn.innerText = "Delete";
          // delete
          deleteBtn.addEventListener("click", deleteBtnHandler);
          let downloadBtn = document.createElement("button");
          downloadBtn.classList.add("recordings-download-button");
          downloadBtn.innerText = "Download";
          // download
          downloadBtn.addEventListener("click", donwloadBtnHandler);
          audioContainer.appendChild(deleteBtn);
          audioContainer.appendChild(downloadBtn);
  
          audio.controls = true;
          audio.src = window.URL.createObjectURL(cursor.value.media);
          gbody.appendChild(audioContainer);
        } 
        cursor.continue();
      }
    };
  }

  //delete item from gallery
  function deleteMediaFromRecordings(mId) {
    let tx = db.transaction("recordings", "readwrite");
    let recordings = tx.objectStore("recordings");
    //console.log(mId);
    //Typecasting to a number is imp because we have stored Date.now() which gives us a number
    recordings.delete(Number(mId));
  }
  
  // delete item from ui
  function deleteBtnHandler(e) {
    let mId = e.currentTarget.parentNode.getAttribute("data-mId");
    deleteMediaFromRecordings(mId);
    e.currentTarget.parentNode.remove();
  }
  
  // download video or image
  function donwloadBtnHandler(e) {
    let a = document.createElement("a");
    a.href = e.currentTarget.parentNode.children[0].src;
    // checks if the element is video or img so that we can define the extension 
      a.download = "audio.mp3";
    a.click()
    a.remove()
  }