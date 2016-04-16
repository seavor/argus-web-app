// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var url = require('url');

var httpServer = http.createServer(function requestHandler(req, res) {
    var parsedUrl = url.parse(req.url);

    console.log("The Request is: " + parsedUrl.pathname);

    // Read in the file they requested
    fs.readFile(__dirname + parsedUrl.pathname, function (err, data) {
        // if there is an error
        if (err) {
            res.writeHead(500);
            return res.end('Error loading ' + parsedUrl.pathname);
        }
        // Otherwise, send the data, the contents of the file
        res.writeHead(200).end(data);
    });
}).listen(8080);

// Array of connected pis
var pis = [];

// Array of connected web users
var clients = [];

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

var fakeEyes = [
    {
        position: 'head',
        side: 'center'
    },
    {
        position: 'ear',
        side: 'right'
    },
    {
        position: 'ear',
        side: 'left'
    },
    {
        position: 'shoulder',
        side: 'right'
    },
    {
        position: 'shoulder',
        side: 'left'
    },
    {
        position: 'hand',
        side: 'right'
    },
    {
        position: 'hand',
        side: 'left'
    },
    {
        position: 'chest',
        side: 'center'
    },
    {
        position: 'upperback',
        side: 'center'
    },
    {
        position: 'lowerback',
        side: 'center'
    },
    {
        position: 'thigh',
        side: 'right'
    },
    {
        position: 'thigh',
        side: 'left'
    }
];

var activeFakeEyes = 0;

var fakePiAssets = (function(){
    var base = './images/fake-cams/',
        feeds = fs.readdirSync(base),
        assets = [],
        collection, feed, fx, images, ix, image;

    for (fx in feeds) {
        feed = feeds[fx];
        if (fs.lstatSync(base + feed).isDirectory()) {
            collection = [];
            images = fs.readdirSync(base + feed);
            for (ix in images) {
                image = images[ix];
                if (fs.lstatSync(base + feed + '/' + image).isFile()) {
                    collection.push('data:image/jpeg;base64,' + fs.readFileSync(base + feed + '/' + image, 'base64'));
                }
            }

            assets.push(collection);
        }
    }

    return assets;
})();

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
// We are given a websocket object in our function
io.sockets.on('connection', function (socket) {

    // Generic Requests
    socket.on('who', newConnection);
    socket.on('disconnect', disconnect);

    // PI Requests
    socket.on("image", newImage);
    socket.on("memePi", newFakePi);

    // Web Requests
    socket.on("selectFeed", selectMainFeed);


    /* Generic Request Handlers
    /*******************************************/

    function newConnection(data) {
        console.log("New Connection: " + (data.type || data) + "[" + (data.src || socket.id) + "]");

        var availClients = clients.length,
            i = 0;

        socket.argus = data;

        if (data.type == "pi") {
            pis.push(socket);

            // If first pi is being initialed,
            // default connected clients' mainfeed
            if (pis.length === 1 && availClients) {
                for (i; availClients > i; i++) {
                    clients[i].mainFeed = pis[0].id;
                }
            }
        } else {
            // If a pi connection is available
            if (pis.length) { socket.mainFeed = pis[0].id;}
            clients.push(socket);
        }
    }

    function disconnect() {
        console.log("Disconnected: " + socket.argus.type + "[" + socket.id + "]");
        var idx;

        if (socket.argus.type == 'pi') {
            idx = pis.indexOf(socket);
            if (socket.argus.fake) { activeFakeEyes--; }
            if (idx != -1) { pis.splice(idx, 1); }
        } else {
            idx = clients.indexOf(socket);
            if (idx != -1) { clients.splice(idx, 1); }
        }
    }

    /* PI Request Handlers
    /*******************************************/

    function newImage(data) {
        var availClients = clients.length,
            i = 0;

        socket.lastimage = data;

        for (i; availClients > i; i++) {
            // Send image with pi_id and imagedata packed in object
            if (clients[i].mainFeed == socket.id) {
                clients[i].emit("mainFeed", {
                    "id": socket.id,
                    "imageData": data,
                    "eye": socket.argus
                });
            }
        }
    }

    function newFakePi(data) {
        var useEye = fakeEyes[activeFakeEyes % fakeEyes.length];

        newConnection({
            type: 'pi',
            fake: true,
            position: useEye.position,
            side: useEye.side
        });

        activeFakeEyes++;

        var feed = fakePiAssets[pis.length % 10],
            counter = 0;

        setInterval(function() {
            newImage(feed[counter]);
            counter = (counter == feed.length - 1) ? 0 : counter + 1;
        }, (1000 / 5));
    }

    /* Web Requests
    /*******************************************/

    function selectMainFeed(id) {
        console.log('Main Feed Selected: ', id);

        var availPis = pis.length,
            i = 0,

            feedAvailable = false;

        for (i; availPis > i; i++) {
            if (pis[i].id === id) {
                feedAvailable = true;
            }
        }

        socket.mainFeed = feedAvailable ? id : (availPis ? pis[0].id : null);
    }
});

// Send out the images every 2 seconds to web clients
setInterval(function() {
    var images = {},

        availPis = pis.length,
        pi,
        p,

        availClients = clients.length,
        client,
        c;

    if (availClients) {
        // Store current images in formatted object
        for (p = 0; availPis > p; p++) {
            pi = pis[p];

            if (pi.lastimage) {
                images[pi.id] = {
                    "id": pi.id,
                    "imageData": pi.lastimage,
                    "position": pi.position,
                    "side": pi.side
                };
            }
        }

        // Loop thru connected clients
        for (c = 0; availClients > c; c++) {
            client = clients[c];

            // If image set has client's mainFeed image, remove
            if (images[client.mainFeed]) { delete images[client.mainFeed]; }
            // Else, reassign mainFeed image to first registered pi
            else { client.mainFeed = availPis ? pis[0].id : null; }

            // Push image set to client
            client.emit("cams", images);
        }
    }
}, 2000);



