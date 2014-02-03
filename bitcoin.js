/**
 * Created by jsmith on 12/20/13.
 */

var https = require('https');
var mongoose = require('mongoose');
var bitcoin = require('bitcoin');
var _ = require('underscore');

// Load Models
mongoose.connect('mongodb://localhost/coindivvy');
var Account = require('./models/account.js');

// Create bitcoin client instance
var client = new bitcoin.Client({
    host: 'localhost',
    port: 8332,
    user: '0MNdueMvHGoZs1zNqHLvYMKFm3dB2zC5ATa',
    pass: '7m9FoCAg11w4KV4YZYMKxscEf9wLSPjUL2NuSNeGK5zx'
});


function getBlockCount(callback) {
    client.getBlockCount(function (err, blockCount) {
        if (err) return console.error(err);
        callback(blockCount);
    });
}

// Lists all the accounts and their balances
function listAccounts(callback) {
    client.listAccounts(function (err, accounts) {
        if (err) return console.error(err);
        callback(accounts);
    });
}

// Create an Address and an Account.  It returns the Address
// The serverName must be unique to keep the addresses specific to the account
function getNewAddress(account, callback) {
    client.getNewAddress(account, function (err, address) {
        if (err) return console.error(err);
        callback(address);
    });
}

function getAddressByAccount(account, callback) {
    client.getAddressesByAccount(account, function (err, address) {
        if (err) return console.error(err);
        callback(address);
    });
}

// send from one account to many other accounts
// the transfers should be an object formatted as {address:amount,...}
function send(fromAccount, transfers, callback) {
    client.sendMany(fromAccount, transfers, function (err, result) {
        if (err) return console.error(err);
        callback(result);
    });
}

function btcValue(callback) {
    var request = https.request(
        {host: 'www.bitstamp.net', path: '/api/ticker/'},
        function (response) {
            var body = ""
            response.on('data', function (data) {
                body += data;
            });
            response.on('end', function () {
                var responseObject = JSON.parse(body);
                if (callback != undefined) {
                    callback(responseObject);
                }
            });
        }
    );
    request.on('error', function (e) {
        console.log('Problem with request: ' + e.message);
    });
    request.end();
}

function test() {

    btcValue(function (btc_usd) {
        console.log('BTC_USD:\t\t', btc_usd.last);

        // EVERY DAY: Process all account balances

        // Get all of the accounts that have a balance
        listAccounts(function (accounts) {
            for (var accountName in accounts) {
                var balance = accounts[accountName];
//                console.log("Processing: " + accountName + " (" + balance + ")");

                // Get the account info from database
                if (balance >= .0001) {
                    Account.findOne({ 'name': accountName }).exec(function (err, account) {
                        if (err) return handleError(err);

                        if (account !== null) {

                            // Calculate the total hashes for the account
                            var hashes_total = _.reduce(account.addresses, function (sum, address) {
                                return sum + address.hashes;
                            }, 0);

                            var accountInformation = {
                                hashes_total: hashes_total,
                                amount_total: accounts[account.name],
                                usd_btc: btc_usd.last,
                                fee_period: account.fee_period,
                                fee_per_hash: account.fee_per_hash
                            };

                            // Calculate each address transaction data (amount, fees, etc)
                            var transfers = {};
                            account.addresses.forEach(function (address, i, addresses) {
//                                transfers[address.address] = Math.round(1e8 * accountInformation.amount_total * address.hashes / hashes_total) / 1e8 - .0001;
                                transfers[address.address] = .0001;
                            });

                            // Calculate the transfers total
                            var transfers_total = 0;
                            for (var transfer in transfers) {
                                transfers_total += transfers[transfer] + .0001;
                            }
                            transfers_total = Math.round(1e8 * transfers_total) / 1e8;

                            if (transfers_total != accountInformation.amount_total) {
                                console.error(account.name, "Totals do not match:", transfers_total, accountInformation.amount_total);
                            } else {
                                send(account.name, transfers, function (transactionId) {
                                    // Record the transaction to database
                                    console.log(transactionId);
                                });

                                console.log(account.name, transfers);
                            }
//                            console.log(account.name + ': ', accountInformation, '\n');
                        }
                    });
                }
            }
        });


//    getBlockCount(function (blockCount) {
//        console.log('Block Count:\t', blockCount);
//    });

//    listAccounts(function (accounts) {
//        console.log('Accounts:\t', accounts);
//    });

//    getAddressByAccount("Bit Collector", function(address) {
//        console.log('Bit Collector Address:\t', address);
//    });


        // DO ONCE: Create the accounts (18 of them) and record the address that is returned

        // DO EACH TIME AN ACCOUNT IS CREATED: Backup wallet.


    });

}
test();
