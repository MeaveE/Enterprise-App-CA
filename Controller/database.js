var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("Astro");
  var myobj = [
    { username: 'Alex', password: 'Runnerbean'},
    { username: 'Amy', password: 'RoseMary'},
    { username: 'Eveyln', password: 'AmyRose'},
    { username: 'Hannah', password: 'Password'},
    { username: 'Michael', password: 'Avatar'},
    { username: 'Sandy', password: 'AngelSea'},
    { username: 'Betty', password: 'CottageRose'},
  ];
  dbo.collection("users").insertMany(myobj, function(err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
    db.close();
  });
});