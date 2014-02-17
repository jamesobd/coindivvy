var express = require('express');
var app = express();
var mongoose = require('mongoose');
var _ = require('underscore');


// Load Models
mongoose.connect(process.env.COINDIVVY_DB_HOST);
//mongoose.connect('mongodb://localhost/coindivvy');
var Account = require('./models/account.js');


/********************************************************
 * Page Routes
 *******************************************************/
app.set('view engine', 'ejs');

// Home page
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/views/pages/page-blank.html');
});

// Sign in page
app.get('/signin', function (req, res) {
    res.sendfile(__dirname + '/views/pages/page-login.html');
});

// Address page
app.get('/address/:address', function (req, res) {
    var params = req.params;

    // Query database for a list of accounts this out-address belongs to
    Account.find({ 'addresses.address': params.address }).exec(function(err, accounts) {
        if (err) return handleError(err);
        accounts.forEach(function(account, i, accounts) {

        });

        // Send the results to the render function
        res.render(__dirname + '/views/pages/table-basic.ejs',
            {
                params: params,
                accounts: accounts
            }
        );
    });

});


// Server static files
app.use(express.static(__dirname + '/static'));

app.get('/test', function (req, res) {
    Account.find({ 'addresses.address': '1MuZ6a9z1tqub3pNSy9Xo2HJT1ThMTbA7z' }).exec(function(err, accounts) {
        if (err) return handleError(err);
        res.send(accounts);
    });

});

app.listen(25943);
console.log('Listening on port 25943');