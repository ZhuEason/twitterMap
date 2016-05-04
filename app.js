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
    //res.setHeader('Content-Type', 'text/html');
    console.log("FIRST INIT PROGRAM");
    res.sendfile('./html/helloWorld.html');
});

app.use(function(req, res, next) {
    var d= '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        d+= chunk;
    });
    req.on('end', function() {
        req.rawBody = d;
        next();
    });
});

app.post('/', function(req, res) {
    //res.send("message receive");

    //data = JSON.stringify(req.rawBody);

    console.log(req.rawBody.Message);
    console.log(req.headers);

    if (req.headers.hasOwnProperty("x-amz-sns-message-type")) {
        type = req.headers['x-amz-sns-message-type'];
        if (req.rawBody["SignatureVersion"] == '1') {
            console.log("success");
        } else {
            console.log("error");
            res.end();
        }

        if (type == "Notification") {
            console.log("Notification:" + req.rawBody.Message);
        } else if (type == "SubscriptionConfirmation") {
            Token = req.rawBody["Token"];
            SubscribeURL = req.rawBody["SubscribeURL"];
            TopicArn = req.rawBody["TopicArn"];
            //sns.confirmSubscription()

            console.log("SubscriptionConfirmation's token: " + req.rawBody["TopicArn"]);
        } else if (type == "UnsubscribeConfirmation") {
            console.log("unSubscription");
        }
    }
    res.send("sssssss!");
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