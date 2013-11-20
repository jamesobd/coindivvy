var express = require('express');
var app = express();

/********************************************************
 * Page Routes
 *******************************************************/

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
    var testAddress = '1FskzjeFxqGU2dSSncfvFK29CojXFTmQk';
    res.sendfile(__dirname + '/views/pages/table-basic.html');
};
app.get('/address', addressRoute);
app.get('/address/:id', addressRoute);



// Server static files
app.use(express.static(__dirname + '/static'));

app.listen(3000);
console.log('Listening on port 3000');