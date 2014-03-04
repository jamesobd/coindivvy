var fs = require('fs');

// Load Models
var Account = require('./models/account.js');


var coin = require('./coins/' + 'bitcoin');
coin.client.listAccounts(function (err, accounts) {
    var accountName = 'delmonger_test1';

    console.log(accounts);

});