var express = require('express');
var app = express();
var elasticsearch = require('elasticsearch');
var fs = require('fs');
var bodyParser = require('body-parser');

//var data = fs.readFileSync('./html/helloWorld.html', 'utf8');

app.use(bodyParser.urlencoded({ extended: true }));

var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'info'
});

app.use(express.static(__dirname));

app.get('/',  function(req, res) {
    console.log("Got a GET request for the homepage");
    //res.setHeader('Content-Type', 'text/html');
    res.sendfile('./html/helloWorld.html');
});

app.get('/data', function(req, res) {
    res.send("get method of data : " + req.query.username);
});

app.post('/data', function(req, res) {
    console.log("post metheo got!");
    console.log(req.body);
    client.search({
        index: 'twitter',
        type: 'people',
        body: {
            query: {
                match_phrase: {
                    text: req.body.keyword
                }
            }
        }
    }, function(error, response) {
    //console.log(response.hits.hits[0]._source.coordinates);
        res.send(response);
    });
});


var server = app.listen(8081, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)

});