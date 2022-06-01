const video = document.getElementById('video');
//load all the models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'), //load face detection model
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'), //load face landmark model
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'), //load face recognition model
  faceapi.nets.faceExpressionNet.loadFromUri('/models') //load face expression model
]).then(startVideo)

function startVideo() {
    //hook upwebcam to vedio element
    navigator.getUserMedia(
        { video: {}},
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize) //resize canvas to match video
    //every time the video plays, run the detectFaces function
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks().withFaceExpressions()
      //mapp the size of the video to the size of the canvas
     const resizedDetections = faceapi.resizeResults(detections, displaySize)
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height) //clear the canvas
      faceapi.draw.drawDetections(canvas, resizedDetections) //draw the detections on the canvas also show % of expressions
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections) //draw the landmarks on the canvas
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections) //draw the expressions on the canvas ie happy, sad, angry, surprised
    }, 100)
})
startVideo();

