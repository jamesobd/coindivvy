var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/coindivvy');
//mongoose.connect(process.env.COINDIVVY_DB_HOST);

// Load Models
var Account = require('./models/account.js');


var coin = require('./coins/' + 'bitcoin');
coin.client.listAccounts(coin.minConfirmations, function (err, accounts) {
    console.log(accounts);

    coin.client.getBalance('*', coin.minConfirmations, function (err, balance) {
        console.log(balance);
    });
});