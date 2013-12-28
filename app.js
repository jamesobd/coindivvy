var express = require('express');
var app = express();
var mongoose = require('mongoose');
var _ = require('underscore');


// Load Models
mongoose.connect('mongodb://localhost/coindivvy');
var Account = require('./models/account.js');


/********************************************************
 * Page Routes
 *******************************************************/
app.set('view engine', 'ejs');

// Home page
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/views/pages/index.html');
});

// Sign in page
app.get('/signin', function (req, res) {
    res.sendfile(__dirname + '/views/pages/page-login.html');
});

// Address page
app.get('/address/:id', function (req, res) {
    var address = req.params.id;

    // Query database for a list of accounts this out-address belongs to
    var accounts = [
        {
            name: "server 1",
            address: "asdf",
            owner: "delmonger",
            coin_type: "bitcoin",
            hashes: 2000000000000,
            addresses: [
                {
                    id: "12mshoCg8tGAejUf2wcxZQqfJvB5LNfhrp",
                    hashes: 35000000000,
                    transactions: [
                        {
                            id: 1,
                            timestamp: new Date,
                            hashes: 35000000000,
                            hashes_total: 2000000000000,
                            amount_total: Number,
                            btc_usd: Number,
                            fee: Number,
                            action: String
                        }
                    ]
                }
            ]
        }
    ];

    var transactions = [
        {
            account: "server 1",
            name: "server 1",
            timestamp: new Date,
            hashes: 35000000000,
            amount_total: 1
        }
    ];

    // Send the results to the render function

    res.render(__dirname + '/views/pages/table-basic.ejs',
        {
            address: address,
            transactions: transactions,
            accounts: accounts
        }
    );
});


// Server static files
app.use(express.static(__dirname + '/static'));

app.get('test', function (req, res) {
    Account.find({ 'addresses.address': '13zxWKU9oAuxDLDPfi2xXnggSCMmeTBFj3' }).exec(function() {

    });

});

app.get('/testcreate', function (req, res) {
    // Create an account
    Account.create({
        name: "server 1",
        address: "asdf",
        owner: "delmonger",
        coin_type: "bitcoin",
        hashes: 2000000000000,
        addresses: [
            {
                id: "12mshoCg8tGAejUf2wcxZQqfJvB5LNfhrp",
                hashes: 35000000000,
                transactions: [
                    {
                        id: 1,
                        timestamp: new Date,
                        hashes: 35000000000,
                        hashes_total: 2000000000000,
                        amount: 1,
                        amount_total: Number,
                        btc_usd: Number,
                        fee: Number,
                        action: String
                    }
                ]
            }
        ]
    }, function (err, account) {
        res.send(account1);
    });
});

app.listen(3000);
console.log('Listening on port 3000');