var http = require('http');
var url = require('url');
var fs = require('fs');
	
//works but no CSS
http.createServer(function(req, res){
	var q = url.parse(req.url,true);
	if(q.pathname == '/')
		var filename =(__dirname + "/../"+"View/index.html");
	else
		filename=(__dirname + "/../View"+ q.pathname);

	console.log(filename);
	fs.readFile(filename, function(err, data){
		if(err){
			res.writeHead(404,{'Content-Type': 'text/html'});
			return res.end("404 Not Found");
		}

		res.writeHead(200,{'Content-Type':'text/html'});	
		res.write(data);
		return res.end();
		
	});

}).listen(8080);
console.log('Server Running on localhost:8080');