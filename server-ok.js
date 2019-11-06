// server.js
// load the things we need
var express = require('express');
var app = express();
var PORT = process.env.PORT || 8000;

//the public_html folder
app.use(express.static("public"));

// set the view engine to ejs
app.set('views', 'views'); //folder to look for the ejs templetes
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file



var plotly = require('plotly')("rasputtim", "DjQ64fAu0mkHfPzdpSEu")
var graphHTML = "";

var fs = require('fs');

var trace1 = {
  x: [1, 2, 3, 4],
  y: [10, 15, 13, 17],
  type: "scatter"
};

var figure = { 'data': [trace1] };

var imgOpts = {
    format: 'png',
    width: 1000,
    height: 500
};

plotly.getImage(figure, imgOpts, function (error, imageStream) {
    if (error) return console.log (error);

    var fileStream = fs.createWriteStream('public/graphs/1.png');
    imageStream.pipe(fileStream);
});

// grab the figure from an existing plot
plotly.getFigure('rasputtim', 0, function (err, figure) {
	if (err) return console.log(err);

	var imgOpts = {
		format: 'png',
		width: 1000,
		height: 500
	};

    plotly.getImage(figure, imgOpts, function (error, imageStream) {
        if (error) return console.log (error);

        var fileStream = fs.createWriteStream('public/graphs/2.png');
        imageStream.pipe(fileStream);
    });
});



// index page 
app.get('/home', function(req, res) {
    //controller
    var name = "Salvatore";
    var emailaddress = "meuemail@teste.com";

    var params = {username: name , email: emailaddress, graph: graphHTML};
    //view
    res.render('home',params);
    
    
});

// about page 
app.get('/about', function(req, res) {
    res.write("this is the about page");
    res.end();
    //res.render('pages/about');
});

app.listen(PORT, function(){
    console.log(PORT +' is the magic port');
});


