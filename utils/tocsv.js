var fs = require('fs');
var mongoose = require('../node_modules/mongoose');

// Load Models
mongoose.connect('mongodb://localhost/coindivvy');
var Account = require('../models/account.js');


var lines = fs.readFileSync(__dirname + '/csv.csv', 'utf8').split('\n');

// Go through each line and group the
var accounts = {};
lines.forEach(function (line, i, lines) {
    if (i != 0) {
        var values = line.split(',');
        var account = values[0];
        var newAddress = {address: values[1], hashes: values[2], notes: values[3]};

        // If the account is not in the accounts object then add it
        if (typeof accounts[account] === 'undefined') {
            accounts[account] = {
                name: account,
                data: {
                    owner: 'delmonger',
                    address: 'asdf',
                    coin_type: 'bitcoin',
                    addresses: [],
                    fee_period: 30,
                    fee_per_hash: 2e-10
                }
            };
        }
        // Add the address
        accounts[account]['data']['addresses'].push(newAddress);
    }
});

// Look through the accounts and save them to mongo
var myCount = 0;
var accountSize = 0;
for (var key in accounts) {
    if (accounts.hasOwnProperty(key)) accountSize++;
}

for (var key in accounts) {
    if (accounts.hasOwnProperty(key)) {
        console.log("saving: " + key);

        Account.update({name: accounts[key].name}, accounts[key].data, {upsert: true}, function (err, numberAffected, raw) {
            if (err) return console.log(err);
            console.log("saved: " + ++myCount);

            if (myCount == accountSize) {
                process.exit();
            }
        });
    }
}