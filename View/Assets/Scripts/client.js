//client.js

function account(){
	
	console.log("client js");

  var x = document.getElementById("accountinfo");
  var y = document.getElementById("accountbtn");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
};

$("accountbtn").click(function(){
	console.log("client.js ")
})
$(document).ready(function(){console.log("hello world");});