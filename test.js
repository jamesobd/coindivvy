var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/coindivvy');
mongoose.connect('mongodb://coindivvyro:9JF39$MqQR^l^42m@troup.mongohq.com:10051/CoinDivvy');
var exchanges = require('./libraries/exchanges');

// Load Models
var Account = require('./models/account.js');


var coin = require('./coins/' + 'bitcoin');
coin.client.listAccounts(coin.minConfirmations, function (err, accounts) {
    console.log(accounts);

    coin.client.getBalance('*', coin.minConfirmations, function (err, balance) {
        console.log(balance);
    });
});
exchanges.usd(function (usdRate) {
    console.log('BTC_USD = ' + usdRate);
});