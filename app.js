var express = require('express');
var app = express();
//var elasticsearch = require('aws-es');
//var elasticsearch = require('elasticsearch');
var fs = require('fs');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

/*
var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log:'info'
});
*/

var client = require('elasticsearch').Client({
    hosts: 'search-tw*****************st-1.es.amazonaws.com',
    connectionClass: require('http-aws-es'),
    amazonES: {
        region: 'us-east-1',
        accessKey: 'A****************A',
        secretKey: 'A****************A'
    }
});


app.use(express.static(__dirname));

app.get('/', function (req, res) {
    //res.setHeader('Content-Type', 'text/html');
    console.log("FIRST INIT PROGRAM");
    res.sendfile('./html/helloWorld.html');
});


app.get('/data', function (req, res) {
    res.send("get method of data : " + req.query.username);
});

app.post('/data', function(req, res) {
    console.log("post metheo got!");
    console.log(req.body);
    client.search({
        index: 'twitter',
        type: 'people_with_sentiment',
        size: 1000,
        body: {
            query: {
                match_phrase: {
                    text: req.body.keyword
                }
            }
        }
    }, function(error, response) {
    //console.log(response.hits.hits[0]._source.coordinates);
        console.log("the response is " + response);
        res.send(response);
    });
});



app.use(function (req, res, next) {
    var d = '';
    req.setEncoding('utf8');

    req.on('data', function (chunk) {
        d += chunk;
    });
    req.on('end', function () {
        req.rawBody = d;
        next();
    });
});



app.post('/', function (req, res) {
    //res.send("message receive");
    //data = JSON.stringify(req.rawBody);
    console.log("???????????????????????" + new Date());
    console.log(req.rawBody);
    console.log(req.headers);

    obj = JSON.parse(req.rawBody);
    cont = JSON.parse(obj["Message"]);
    if (req.headers.hasOwnProperty("x-amz-sns-message-type")) {
        type = req.headers['x-amz-sns-message-type'];
        if (obj["SignatureVersion"] == "1") {
            if (type == "Notification") {
                console.log("Notification:" + obj["Message"]);
                console.log("sentiment:" + cont["sentiment"]);
                client.index({
                    index: 'twitter',
                    type: 'people_with_sentiment',
                    body: {
                        text: JSON.stringify(obj["Message"])
                    }
                }, function (err, data) {
                    if (err) {
                        console.log('error' + err);
                    } else {
                        console.log('json reply received' + data);
                    }
                });
            } else if (type == "SubscriptionConfirmation") {
                Token = obj["Token"];
                TopicArn = obj["TopicArn"];
                SubscribeURL = obj["SubscribeURL"];
                //sns.confirmSubscription()
                console.log(Token, SubscribeURL, TopicArn);
                //console.log("SubscriptionConfirmation's token: " + req.rawBody["Token"]);
            } else if (type == "UnsubscribeConfirmation") {
                console.log("unSubscription");
            }
        } else {
            console.log("error");
        }
    }
});



var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)

});