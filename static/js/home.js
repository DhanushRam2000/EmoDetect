
// The buttons to start & stop stream and to capture the image
var btnStart = document.getElementById( "btn-start" );
var btnStop = document.getElementById( "btn-stop" );
var btnCapture = document.getElementById( "btn-capture" );

// The stream & capture
var stream = document.getElementById( "stream" );
var capture = document.getElementById( "capture" );
var snapshot = document.getElementById( "snapshot" );

// The video stream
var cameraStream = null;

// Attach listeners
btnStart.addEventListener( "click", startStreaming );
btnStop.addEventListener( "click", stopStreaming );
btnCapture.addEventListener( "click", captureSnapshot );

// Start Streaming
function startStreaming() {

var mediaSupport = 'mediaDevices' in navigator;

if( mediaSupport && null == cameraStream ) {

    navigator.mediaDevices.getUserMedia( { video: true } )
    .then( function( mediaStream ) {

    cameraStream = mediaStream;

    stream.srcObject = mediaStream;

    stream.play();
    })
    .catch( function( err ) {

    console.log( "Unable to access camera: " + err );
    });
}
else {

    alert( 'Your browser does not support media devices.' );

    return;
}
}

// Stop Streaming
function stopStreaming() {

if( null != cameraStream ) {

    var track = cameraStream.getTracks()[ 0 ];

    track.stop();
    stream.load();

    cameraStream = null;
}
}
        function dataURItoBlob( dataURI ) {

    var byteString = atob( dataURI.split( ',' )[ 1 ] );
    var mimeString = dataURI.split( ',' )[ 0 ].split( ':' )[ 1 ].split( ';' )[ 0 ];
    
    var buffer	= new ArrayBuffer( byteString.length );
    var data	= new DataView( buffer );
    
    for( var i = 0; i < byteString.length; i++ ) {
    
        data.setUint8( i, byteString.charCodeAt( i ) );
    }
    
    return new Blob( [ buffer ], { type: mimeString } );
}

function captureSnapshot() {

    btnCapture.disabled = true;
    btnCapture.innerHTML = "wait 5 sec"

    setTimeout(()=>{
        btnCapture.disabled = false;
        btnCapture.innerHTML = "Capture Image"
    },5000)

if( null != cameraStream ) {

    var ctx = capture.getContext( '2d' );
    var img = new Image();

    ctx.drawImage( stream, 0, 0, capture.width, capture.height );

    img.src   = capture.toDataURL( "image/png" );
    img.height = 324;
    img.width = 432;

    var data	= new FormData();
    var dataURI	= img.src;
    var imageData   = dataURItoBlob( dataURI );

    snapshot.innerHTML = '';


    stream.style.borderColor = "#ba312d";
    stream.style.borderWidth = "6px";

    setTimeout(() => {
        stream.style.borderWidth = "3.5px";
        stream.style.borderColor = "black";

    },1000);
    
    
    var formdata = new FormData();    
    formdata.append("image", imageData, "faceimage.jpg");

    
    fetch("/emotion",
                {
                    method:"POST",
                    body: formdata
                })
                .then((res)=>{
                    return res.json();
                })
                .then((data) => {
                    console.log(data.emotion);
                    
                    if(!data)
                    {
                        $("#emoji").html("&#128064");
                    }
                    else if(!data.emotion)
                    {
                        $("#emoji").html("&#128064");
                    }
                    else if(data.emotion == "neutral")
                    {
                        $("#emoji").html("&#128528");
                    }
                    else if(data.emotion == "happy")
                    {
                        $("#emoji").html("&#128515");
                    }
                    else if(data.emotion == "sad")
                    {
                        $("#emoji").html("&#128532");
                    }
                    else if(data.emotion == "surprise")
                    {
                        $("#emoji").html("&#128561");
                    }
                    else if(data.emotion == "fear")
                    {
                        $("#emoji").html("&#128551");
                    }
                    else if(data.emotion == "angry")
                    {
                        $("#emoji").html("&#128545");
                    }
                    else if(data.emotion == "disgust")
                    {
                        $("#emoji").html("&#129314");
                    }
                    else if(data.emotion == "nil")
                    {
                        $("#emoji").html("&#128064")
                    }
                })
                .catch(err=>{
                    console.log(err);
                });
}
}