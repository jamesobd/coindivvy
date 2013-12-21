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
var addressRoute = function (req, res) {
    var address = req.params.id;
    res.render(__dirname + '/views/pages/table-basic.ejs',
        {
            address: address,
            transactions: transactions,
            servers: servers
        }
    );
};

app.get('/address', addressRoute);
app.get('/address/:id', addressRoute);


// Server static files
app.use(express.static(__dirname + '/static'));


app.get('/test', function (req, res) {
    // Create an account
    var account1 = new Account({
        _id: "dell-server 1",
        name: "server 1",
        address: "w38w3jfw83jf8w3fja83ua",
        owner: "dell",
        coin_type: "bitcoin",
        hashes: 2000000000,
        addresses: [
            {
                id: "asdf8aw38ja8w3faojaw8fjaw83",
                hashes: 500000000,
                transactions: [
                    {
                        id: "ao83wfaw8o3fjaow83fjaow8fjawo3f8waaw8of",
                        timestamp: new Date,
                        hashes: 500000000,
                        total_hashes: 2000000000,
                        amount: 1.280864195,
                        total_amount: 5.12345678,
                        action: "add"
                    }
                ]
            }
        ],
        transactions: [
            {
                id: "asdf8aw38ja8w3faojaw8fjaw83",
                timestamp: new Date,
                total_hashes: 2000000000,
                fee: 0.512345678,
                total_amount: 5.12345678,
                action: "add"
            }
        ]
    });

    console.log(account1.get('_id'));
});

app.listen(3000);
console.log('Listening on port 3000');