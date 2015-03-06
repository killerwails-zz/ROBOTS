var canvas = document.getElementById('canvas');
   var context = canvas.getContext('2d');

   var FastTracker = function() {
     FastTracker.base(this, 'constructor');
   };
   tracking.inherits(FastTracker, tracking.Tracker);

   tracking.Fast.THRESHOLD = 2;
   FastTracker.prototype.threshold = tracking.Fast.THRESHOLD;

   FastTracker.prototype.track = function(pixels, width, height) {
     stats.begin();
     var gray = tracking.Image.grayscale(pixels, width, height);
     var corners = tracking.Fast.findCorners(gray, width, height);
     stats.end();

     this.emit('track', {
       data: corners
     });
   };

   var tracker = new FastTracker();

   tracker.on('track', function(event) {
     context.clearRect(0, 0, canvas.width, canvas.height);
     var corners = event.data;
     for (var i = 0; i < corners.length; i += 2) {
       context.fillStyle = '#f00';
       context.fillRect(corners[i], corners[i + 1], 2, 2);
     }
   });

   tracking.track('#video', tracker, { camera: true });