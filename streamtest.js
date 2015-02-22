var cv = require('opencv');

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

  vid.read(function(err, im){
    if (err) throw err;
    if (im.size()[0] > 0 && im.size()[1] > 0){

      im.save('./pic.jpg')

      console.log('Image saved to ./pic.jpg');
    } else {
      console.log("Camera didn't return image")
    }
  });
} catch (e){
  console.log("Couldn't start camera", e)
}
