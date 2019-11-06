// Load the http module to create an http server.
var http = require('http');
const { Client } = require('pg');

const client = new Client ({
  connectionString: process.env.DATABASE_URL, //HEROKU_POSTGRESQL_OLIVE_URL,
  ssl: true,
});
var responseHTML = "TESTE";
var graphHTML = "";
client.connect();

client.query('SELECT * FROM public.ezfin_category', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    responseHTML +=JSON.stringify(row);
    console.log(JSON.stringify(row));
  }
  client.end();
});

var plotly = require('plotly')("rasputtim", "DjQ64fAu0mkHfPzdpSEu")

var data = [
  {
    x: ["2013-10-04 22:23:00", "2013-11-04 22:23:00", "2013-12-04 22:23:00" , "2014-01-04 22:23:00"], 
    y: [1, 3, 6, 4],
    type: "scatter"
  }
];
var graphOptions = {filename: "date-axes", fileopt: "overwrite"};
plotly.plot(data, graphOptions, function (err, msg) {

  graphHTML += JSON.stringify(msg);
    console.log(msg);
});


var PORT = process.env.PORT || 8000;
// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  response.write(graphHTML);
  response.write(responseHTML);
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hello World\n");

});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(PORT);
// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");
