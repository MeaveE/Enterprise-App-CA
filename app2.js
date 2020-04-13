var express = require("express");
var http = require("http");
var app = express();
var fs = require('fs');
var path = require('path');


app.use(express.static(path.join(__dirname + "../View")));

http.createServer(app).listen(8080);

app.get("/", function(req, res) {
  let filename = "../View/index.html";
  fs.readFile(filename, function(err, data) {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html" });
      return res.end("404 Not Found");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      return res.end();
    }
  });
});

/*
var q = url.parse(req.url, true);
	if(q.pathname == '/')
		var filename =(__dirname + "/../"+"View/index.html");
	else
		filename=(__dirname + "/../View" + q.pathname);

	console.log(filename);
	fs.readFile(filename, function(err, data){
		if(err){
		res.writeHead(404,{'Content-Type': 'text/html'});
		return res.end("404 Not Found");
		}
		res.writeHead(200,{'Content-Type':'text/html'});
		res.write(data);
		return res.end();
	});*/