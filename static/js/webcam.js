let v = document.getElementById("myVideo");

//create a canvas to grab an image for upload
let imageCanvas = document.createElement('canvas');
let imageCtx = imageCanvas.getContext("2d");

//Add file blob to a form and post
function postFile(base64) {
    // let formdata = new FormData();
    // formdata.append("file", file);
    // let xhr = new XMLHttpRequest();
    // xhr.open('POST', '/upload', true);
    // xhr.onload = function() {
    //     if (this.status === 200)
    //         console.log(this.response);
    //     else
    //         console.error(xhr);
    // };
    // xhr.send(formdata);

    // Perform file upload
    $.ajax({
        url: "/webcam",
        method: "post",
        // processData: false,
        contentType: "application/json",
        data: JSON.stringify({ file: base64 }),
        // processData: false,
        dataType: 'json',
        success: function(data) {
            add_thumbnails(data);
            set_img_picker();
        },
        error: function(jqXHR, status, error) {
            switch (jqXHR.status) {
                case 400:
                    alert("Must submit a valid file (png, jpeg, or jpg)");
                    break;
                case 404:
                    alert("Cannot connect to model API server");
                    break;
                case 403:
                    alert("You must accept the cookies to upload your own image")
                    break;
                default:
                    alert("error")
                    break;
            }
        },
        complete: function() {
            $("#file-submit").text("Submit");
            $("#file-input").val("");
        }
    })
}

//Get the image from the canvas
function sendImagefromCanvas() {

    //Make sure the canvas is set to the current video size
    imageCanvas.width = v.videoWidth;
    imageCanvas.height = v.videoHeight;

    imageCtx.drawImage(v, 0, 0, v.videoWidth, v.videoHeight);

    //Convert the canvas to blob and post the file
    // imageCanvas.toBlob(postFile, 'image/jpeg');
    var imagefile = imageCanvas.toDataURL("image/jpeg");
    console.log(imagefile)
    postFile(imagefile);
}

//Take a picture on click
v.onclick = function() {
    console.log('click');
    sendImagefromCanvas();
};

window.onload = function() {

    //Get camera video
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
            v.srcObject = stream;
        })
        .catch(err => {
            console.log('navigator.getUserMedia error: ', err)
        });

};