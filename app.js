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


app.post('/', function(req, res) {
    //res.send("message receive");
    console.log(req.body);
    console.log("!!!!!!!!!!!!");
    console.log(req.headers);

    if (req.headers.hasOwnProperty("x-amz-sns-message-type")) {
        type = req.get('x-amz-sns-message-type');
        if (req.body["SignatureVersion"] == '1') {
            console.log("success");
        } else {
            console.log("error");
            res.end();
        }

        if (type == "Notification") {
            console.log("Notification:" + req.body.Message);
        } else if (type == "SubscriptionConfirmation") {
            Token = req.body.Token;
            SubscribeURL = req.body.SubscribeURL;
            TopicArn = req.body.TopicArn;
            //sns.confirmSubscription()

            console.log("SubscriptionConfirmation's token: " + req.body.Token);
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