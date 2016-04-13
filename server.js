// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var url = require('url');
var httpServer = http.createServer(requestHandler);
httpServer.listen(8080);

function requestHandler(req, res) {
  console.log("The Request is: " + parsedUrl.pathname);
  var parsedUrl = url.parse(req.url);

  // Read in the file they requested
  fs.readFile(__dirname + parsedUrl.pathname,
    // Callback function for reading
    function (err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + parsedUrl.pathname);
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200);
      res.end(data);
      }
    );
}

// Array of connected pis
var pis = [];

// Array of connected web users
var web = [];

// ID of Main Feed
var mainFeed = null;

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {

    console.log("We have a new client: " + socket.id);

    // Put in the appropriate array
    socket.on('who', function(data) {
      if (data == "pi") {
        console.log("New PI: ", data);

        pis.push(socket);
        socket.mainFeed = mainFeed || socket.id;
      } else {
        console.log("New Web Client: ", data);
        web.push(socket);
      }

      socket.emit("pis", pis);
    });

    // Web client wants specific high quality stream
    socket.on("highquality", function(pi_id) {
      console.log('Main Feed Selected: ', pi_id);
      socket.mainFeed = pi_id;
    });

    // New image from a pi, send it out to all highqaulity subscribers
    socket.on("image", function(data) {
      console.log("New Image Received: ", data);
      socket.lastimage = data;

      for (var i = 0; web.length > i; i++) {
        // Send image with pi_id and imagedata packed in object
        if (web[i].mainFeed == socket.id) {
          web[i].emit("image", {
            "pi_id": socket.id,
            "label": socket.label,
            "imagedata": data
          });
        }
      }
    });


    // Socket disconnected
    socket.on('disconnect', function() {
      var webindexToRemove = web.indexOf(socket);
      if (webindexToRemove > -1) {
        web.splice(webindexToRemove, 1);
      }

      var pisindexToRemove = pis.indexOf(socket);
      if (pisindexToRemove > -1) {
        pis.splice(pisindexToRemove, 1);
      }
    });
  }
);

// Send out the images every 2 seconds
var lowQualityInterval = setInterval(function() {
  console.log("Sending low");
  var images, w, p;

  // Loop thru connected clients
  for (w = 0; web.length > w; w++) {
    images = [];

    // Store non-mainFeed images
    for (p = 0; pis.length > p; p++) {
      if (pis[p].lastimage && pis[p].id !== web[w].mainFeed) {
        images.push({
          "pi_id": pis[p].id,
          "label": pis[p].label,
          "imageData": pis[p].lastimage
        });
      }
    }

    // Push image set to client
    web[w].emit("pis", images);
  }
}, 2000);

