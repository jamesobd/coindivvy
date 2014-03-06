var Account = require('./models/account.js');


var coin = require('./coins/' + 'bitcoin');
coin.client.listAccounts(function (err, accounts) {
    console.log(err, accounts);
});

Account.findById('delmonger_Coin Auger', function (err, accountDoc) {
    if (err) return console.error(err, accountDoc);

    console.log(accountDoc);
});