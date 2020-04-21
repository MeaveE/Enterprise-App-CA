//avoid https or throws not secure connection

var express = require("express");
var http = require("http");
var app = express();
var url = require('url');
var path = require('path');

var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;//driver
var url = "mongodb://localhost:27017";//your details
var mongoose = require("mongoose");

var HttpMsgs = require("http-msgs");
var session = require("express-session");

var unirest = require("unirest");



mongoose.connect(url);
var urlencodedParser = bodyParser.urlencoded({extended:false});

var schema = new mongoose.Schema({
	username: "String",
	password: "String"
});

var users = mongoose.model("users", schema);

//Create our Express-powered HTTP server and have it listen on port 8080
console.log(__dirname);
app.use(session({secret: 'ssshhhh'}));

app.use('/cssFiles', express.static(__dirname + '/../View'));
app.use('/image', express.static(__dirname + '/../View/Assets/Images'));
app.use('/javascript', express.static(__dirname + '/client.js'));



app.get("/", function (req, res) {
	var sess = req.session;
	console.log(sess);
	res.sendFile(path.join(__dirname + "/../"+"View/index.html"));
});

app.get('/getData', function(req, res){

	var sess = req.session;
	console.log("session" + sess);
	console.log('return fxn.'+ sess.username +" "+ sess.password);


	if(sess.username){
		var doc = {
			username: sess.username,
			password: sess.password,
		};
		HttpMsgs.sendJSON(req,res,{
			items:doc,
		});
	}else{
		res.redirect("/");
	}
/*	MongoClient.connect(url,{useNewURLParser: true, useUnifiedTopology: true}, function(err, db){
			var database = db.db('Astro');
			var collection = database.collection("users");
			var query = {username : sess.uname};
			collection.find(query).toArray((err, result)=>{
			if(err) return console.log(err);
			console.log(result);
		});
	});*/

});

app.post('/signIn', urlencodedParser, function(req, res){

	console.log("signIn" + req.body.uname +req.body.psw);

	MongoClient.connect(url,{useNewURLParser: true, useUnifiedTopology: true}, function(err, db){
			var database = db.db('Astro');
			var collection = database.collection("users");
			var query = {username : req.body.uname};
			collection.find(query).toArray((err, result)=>{
			if(err) return console.log(err);

			console.log(result[0].password + "" + req.body.psw);
			if(result[0].password == req.body.psw){
					console.log('passed');
					var sess=req.session;
					sess.username = req.body.uname;
					sess.password = req.body.psw;
					console.log(sess);
				}
				else{
					console.log("failed");
				}
  			 res.redirect('/');
		});
	});
});

app.post('/register', urlencodedParser, function (req, res) {

	console.log("register" + req.body.uname +req.body.psw);

	var user = {
		username:req.body.uname,
		password:req.body.psw,
	};

	MongoClient.connect(url, {useNewURLParser: true, useUnifiedTopology: true}, async function(err, db){
		if(err){
			db.close();
			throw err;
		}
		else{
			console.log("password" + req.body.psw);
			var database = db.db('Astro');
			var collection = database.collection("users");
			var docs = await collection.insertOne(user);
			console.log("result" + docs);
			db.close();
			console.log('insert sucessful');
			var sess=req.session;
			sess.username = req.body.uname;
			sess.password = req.body.psw;
			db.close();
		}
  		 res.redirect('/');
	});
});


app.post('/update', urlencodedParser, function (req, res) {
	var sess = req.session;
	console.log("update" + req.body.uname + req.body.pws);

	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("Astro");
	  var myquery = { username: sess.username };
	  var newvalues = { $set: {username: req.body.uname, password: req.body.psw } };
	  dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
	    if (err) throw err;
	    console.log("1 document updated");
	    console.log(newvalues);
	    sess.username = req.body.uname;
		sess.password = req.body.psw;
		console.log(sess);
	    db.close();
	  });
	});
   res.redirect('/');
});


app.get('/delete', urlencodedParser, function (req, res) {
	var sess = req.session;
	if(sess.username){
		MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db("Astro");
		  var myquery = { username: sess.username };
		  dbo.collection("users").deleteOne(myquery, function(err, obj) {
		    if (err) throw err;
		    console.log("1 document deleted");
		    db.close();
		  });
		});
	}
	else{
		 res.redirect('/');
	}

});

app.post('/api', urlencodedParser, function(req,res){
	console.log("api fxn." + req.body.zodiacInp);
	sign = req.body.zodiacInp;
	var sess = req.session;
	var millisecondsToWait = 500;
	var doc;
	if(sess.username){

		var url = unirest("POST", "https://sameer-kumar-aztro-v1.p.rapidapi.com/");

		url.query({
			"sign": sign,
			"day": "today"
		});

		url.headers({
			"x-rapidapi-host": "sameer-kumar-aztro-v1.p.rapidapi.com",
			"x-rapidapi-key": "9abc6607eamsh0407aba1195031cp11ab52jsncaf3934674c6",
			"content-type": "application/x-www-form-urlencoded"
		});

		url.form({});

		url.end(async function (res) {
			if (res.err) throw new Error(res.err);

			console.log(res.body);
			doc = {
				dateRange: res.body.date_range,
				currentDate: res.body.current_date,
				description: res.body.description,
				compatability: res.body.compatibility,
				mood: res.body.mood,
				color: res.body.color,
				luckyNumber: res.body.lucky_number,
				luckyTime: res.body.lucky_time,
			};
			console.log(doc);
			senddata();
		});
		console.log("before second if" +doc);

		function senddata(){
			HttpMsgs.sendJSON(req, res,{
				items:doc,
			});
		}
		
	}
});


app.get('/logout',(req,res)=>{
	req.session.destroy((err)=>{
		if(err){
			return console.log(err);	
		}
		res.redirect('/');
	});
});

app.listen(8080, function(){
	console.log("listeing on port 8080");
});


