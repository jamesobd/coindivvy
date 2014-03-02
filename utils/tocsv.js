var fs = require('fs');
var mongoose = require('../node_modules/mongoose');

// Load Models
mongoose.connect('mongodb://localhost/coindivvy');
var Account = require('../models/account.js');

// Collect the account information
var accountSettings = {
    owner: "delmonger",
    fee_address: "1BLc1Tp1GpC1WsesNLrieTJ26b9J436LBz",
    coin_type: "bitcoin",
    unit_name: "GH",
    fee_period: 30,
    fee_per_unit: .2
};

// Process the csv file and collect the accounts/addresses synchronously first
var accounts = {};
var lines = fs.readFileSync(__dirname + '/csv.csv', 'utf8').split('\n');
lines.forEach(function (line, i, lines) {
    if (i != 0) {
        // Parse out the current line
        var values = line.split(',');
        if (values.length != 4) return;

        var accountName = values[0];
        var address = {_id: values[1], units: values[2], notes: values[3]};

        // If the account is not in the accounts object then add it.
        if (accounts[accountSettings.owner + "_" + accountName] === undefined) {
            accounts[accountSettings.owner + "_" + accountName] = {
                _id: accountSettings.owner + "_" + accountName,
                addresses: [],
                coin_type: accountSettings.coin_type,
                fee_address: accountSettings.fee_address,
                fee_period: accountSettings.fee_period,
                fee_per_unit: accountSettings.fee_per_unit,
                owner: accountSettings.owner,
                unit_name: accountSettings.unit_name
            };
        }
        // Add the address
        accounts[accountSettings.owner + "_" + accountName]['addresses'].push(address);
    }
});


// Now save all the accounts asynchronously to the db
for (var accountName in accounts) {
    (function (account) {
        Account.findById(account._id, function (err, accountDoc) {
            if (err) return console.error(err, accountDoc);

            // If the account is not in the database yet save the new account
            if (accountDoc === null) {
                new Account(account).save(function (err, accountDoc, numberAffected) {
                    if (err) return console.error("Trying to create the account", err, accountDoc, numberAffected);

                    console.log("Account created: " + accountDoc._id);
                });
            } else {
                // Upsert all addresses into the account document
                account.addresses.forEach(function (address, i, addresses) {
                    var addressDoc = accountDoc.addresses.id(address._id);

                    // Is the address in the database?
                    if (addressDoc === null) {
                        accountDoc.addresses.push(address);
                    } else {
                        // Update the address document properties
                        for (var prop in address) {
                            addressDoc[prop] = address[prop];
                        }
                    }

                });

                // Save the account
                accountDoc.save(function (err, accountDoc) {
                    if (err) return console.error(err);

                    console.log('Account updated: ' + accountDoc._id);
                });
            }

        });
    })(accounts[accountName])
}
