var express = require("express");
var http = require("http");
var app = express();
var url = require('url');
var path = require('path');
var fs = require('fs');

//Create our Express-powered HTTP server and have it listen on port 8080
console.log(__dirname);
app.use('/cssFiles', express.static(__dirname + '/../View'))
app.use('/image', express.static(__dirname + '/../View/Assets/Images'))

app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname + "/../"+"View/index.html"));
	//res.send("hi from server");
});

app.listen(8080, function(){
	console.log("listeing on port 8080");
})
