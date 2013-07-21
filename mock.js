var express = require('express'),
  fs = require('fs'),
  app = express(),
  args = process.argv.splice(2),
  dir = require('mkdirp'),
  port,
  mockedResponses = {};

if (args[0] !== undefined ) {
  port = args[0].split('=');
} else {
  port = ['port',3000];
}

app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + "/responses" }));

var getMimeType = function (filePath) {
  var fileTypes = {
      xml  : 'application/xml',
      json : 'application/json',
      txt  : 'text/html' },
    fileExtension = filePath.split('.').pop(),
    mimeType = fileTypes[fileExtension];

  return (mimeType === undefined ? 'text/html' : mimeType);
};

var serveFile = function (localPath, res, mimeType) {
  fs.readFile(localPath, function(err, contents) {
    if(!err) {
      res.setHeader("Content-Length", contents.length);
      res.setHeader("Content-Type", mimeType);
      res.statusCode = 200;
      res.end(contents);
    } else {
      res.writeHead(500); 
      res.end();
    }
  });
};

var evaluateRoutes = function (urlRequest){
  //routes is used just to re route in case we are just looking for a substring in the URI
  //useful when the client issues random strings as part of the request
  var routes = {
    "/path/":"/path/staticResponse",
    "/IdontCareWhatIsTheRestOfThisPath":"/respondeWithThis"
  };
  for (var route in routes) {
    if (urlRequest.indexOf(route) !== -1) {
      console.log("Using route rule: " + routes[route]);
      return routes[route];
    }
  }
  return urlRequest;
};

var isNumber = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

app.all('/*', function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

app.get('/*', function(req, res, next){
  var filePath;
  console.log("Received: " + req.originalUrl);
  filePath = mockedResponses[evaluateRoutes(req.originalUrl)];
  console.log("Serving file: " + filePath);
  if (filePath === undefined) {
    res.send(404);
  } else {
    serveFile(filePath, res, getMimeType(filePath));
  }
});

app.post('/*', function(req, res, next){  
  var temPath = req.files.file.path, urlKey = req.originalUrl;
  mockedResponses[urlKey] = temPath;
  console.log("Response saved to " + temPath);
  res.send('Response saved to ' + urlKey);
});

if (port && port[0] === 'port' && isNumber(port[1])) {
  dir('./responses', function(err) {
    console.log("Using: ./responses directory " + err);
  });
  console.log("MockJS running on port " + port[1] );
  app.listen(port[1]);
} else {
  console.log("Usage: node mock.js port=$PORT_NUMBER\n");
  process.exit(0);
}
