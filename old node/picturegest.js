var cv = require('opencv');
var COLOR = [0, 255, 0]; // default red
var thickness = 2; // default 1
try {
  var vid = new cv.VideoCapture(0);
  var window = new cv.NamedWindow('Video', 0)
  
  setInterval(function() {
    vid.read(function(err, im) {
      if (err) throw err;
      console.log(im.size())
      if (im.size()[0] > 0 && im.size()[1] > 0){
        window.show(im);
      }
      window.blockingWaitKey(0, 50);
    });
  }, 20);

  cv.readImage('./files/mona.png', function(err, im) {
  if (err) throw err;
  if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');

  im.detectObject('../data/haarcascade_frontalface_alt2.xml', {}, function(err, faces) {
    if (err) throw err;

    for (var i = 0; i < faces.length; i++) {
      face = faces[i];
      im.rectangle([face.x, face.y], [face.x + face.width, face.y + face.height], COLOR, 2);
    }

    im.save('./tmp/face-detection-rectangle.png');
    console.log('Image saved to ./tmp/face-detection-rectangle.png');
  });
  }catch (e){
  console.log("Couldn't start camera", e)

});