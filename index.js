var express = require('express');
var app = express();
var _ = require('underscore');
var MongoClient = require('mongodb').MongoClient


/********************************************************
 * Page Routes
 *******************************************************/
app.set('view engine', 'jade');

// Home page
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/views/pages/page-blank.html');
});

// Sign in page
app.get('/signin', function (req, res) {
    res.sendfile(__dirname + '/views/pages/page-login.html');
});

// Address page

// Query database for a list of accounts this out-address belongs to
//MongoClient.connect("mongodb://divvy-ro%3AM0R%40on%25PhBOg%4037Xa@troup.mongohq.com:10051/CoinDivvy", function (err, db) {
MongoClient.connect(process.env.COINDIVVY_DB_HOST, function (err, db) {
//MongoClient.connect("mongodb://localhost:27017/coindivvy", function (err, db) {
    if (err) return console.error(err);

    app.get('/address/:address', function (req, res) {
        var params = req.params;

        // Create the match
        var match = {$match: {}};
        match.$match["transactions.amounts." + params.address] = {$exists: true};

        db.collection("accounts").aggregate([
            {$unwind: "$transactions"},
            match,
            {$project: {_id: 1, address: 1, fee_address: 1, transactions: 1, unit_name: 1}},
            {$sort: { "transactions.timestamp": -1}}
        ], function (err, results) {
            if (err) return console.error(err);

            // Send the results to the render function
            res.render(__dirname + '/views/pages/table-basic.jade',
                {
                    params: params,
                    results: results
                }
            );
        });
    });
});


// Server static files
app.use(express.static(__dirname + '/static'));

app.get('/test', function (req, res) {

});

app.listen(25943);
console.log('Listening on port 25943');