// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var url = require('url');
var httpServer = http.createServer(requestHandler);
httpServer.listen(8080);

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
// We are given a websocket object in our function
io.sockets.on('connection', function (socket) {
  console.log("We have a new client: " + socket.id);

  // Put in the appropriate array
  socket.on('who', function(data) {
    console.log("New Connection: ", data);

    if (data == "pi") {
      pis.push(socket);
    } else {
      // socket.mainFeed = pis.length ? pi[0].id || null; // @TODO
      web.push(socket);
    }
  });

  // Web client wants specific high quality stream
  socket.on("highquality", function(pi_id) {
    console.log('Main Feed Selected: ', pi_id);
    socket.mainFeed = pi_id;
  });

  // New image from a pi, send it out to all highqaulity subscribers
  socket.on("image", function(data) {
    socket.lastimage = data;

    for (var i = 0; web.length > i; i++) {
      // Send image with pi_id and imagedata packed in object
      if (web[i].mainFeed == socket.id) {
        web[i].emit("image", {
          "pi_id": socket.id,
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
});

// Send out the images every 2 seconds
setInterval(lowQualityInterval, 2000);

function lowQualityInterval() {
  // Loop thru connected clients
  for (var i = 0; web.length > i; i++) {
    sendImages(web[i]);
  }
}

function sendImages(socket) {
  var images = [];

  // Store non-mainFeed images
  for (var i = 0; pis.length > i; i++) {
    if (pis[i].lastimage && pis[i].id !== socket.mainFeed) {
      images.push({
        "id": pis[i].id,
        "imageData": pis[i].lastimage
      });
    }
  }

  // Push image set to client
  socket.emit("pis", images);
}

function requestHandler(req, res) {
  var parsedUrl = url.parse(req.url);

  console.log("The Request is: " + parsedUrl.pathname);

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

