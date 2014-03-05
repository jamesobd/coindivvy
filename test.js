// Load Models
var mongoose = require('mongoose');

// Load Models
mongoose.connect('mongodb://localhost/coindivvy');
var Account = require('./models/account.js');


var coin = require('./coins/' + 'bitcoin');
coin.client.listAccounts(function (err, accounts) {
    console.log(err, accounts);
});
