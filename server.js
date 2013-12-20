var express = require('express');
var app = express();

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
    var transactions = [
        {
            server: "Server #1",
            timestamp: new Date(1388534400000),
            amount: Math.round(Math.random()*5*100000000)/100000000,
            action: "add"
        },
        {
            server: "Server #2",
            timestamp: new Date(1388534400000),
            amount: Math.round(Math.random()*5*100000000)/100000000,
            action: "add"
        },
        {
            server: "Server #1",
            timestamp: new Date(1388535300000),
            amount: Math.round(Math.random()*5*100000000)/100000000,
            action: "add"
        },
        {
            server: "Server #2",
            timestamp: new Date(1388535300000),
            amount: Math.round(Math.random()*5*100000000)/100000000,
            action: "add"
        },
        {
            server: "Server #1",
            timestamp: new Date(1388536200000),
            amount: Math.round(Math.random()*5*100000000)/100000000,
            action: "add"
        },
        {
            server: "Server #2",
            timestamp: new Date(1388536200000),
            amount: Math.round(Math.random()*5*100000000)/100000000,
            action: "add"
        },
        {
            server: "Server #1",
            timestamp: new Date(1388537100000),
            amount: Math.round(Math.random()*5*100000000)/100000000,
            action: "add"
        },
        {
            server: "Server #2",
            timestamp: new Date(1388537100000),
            amount: Math.round(Math.random()*5*100000000)/100000000,
            action: "add"
        },
        {
            server: "Server #1",
            timestamp: new Date(1388538000000),
            amount: Math.round(Math.random()*5*100000000)/100000000,
            action: "add"
        },
        {
            server: "Server #2",
            timestamp: new Date(1388538000000),
            amount: Math.round(Math.random()*5*100000000)/100000000,
            action: "add"
        }
    ];
    var servers = [
        {
            server: "Server #1",
            hashes: 100000000
        },
        {
            server: "Server #2",
            hashes: 250000000
        }
    ];
//    var testAddress = '1FskzjeFxqGU2dSSncfvFK29CojXFTmQk';
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

app.listen(3000);
console.log('Listening on port 3000');