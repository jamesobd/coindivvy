/**
 * Created by jsmith on 12/20/13.
 */

var util = require('util');
var https = require('https');
var mongoose = require('mongoose');
var _ = require('underscore');
var exchanges = require('libraries/exchanges');

// Load Models
mongoose.connect('mongodb://localhost/coindivvy');
var Account = require('./models/account.js');


// Get a list of all coin types in the database
Account.distinct('coin_type', function (err, coinTypes) {
    // Get a list of all currency values
    exchanges.usd(function (usdRate) {

        coinTypes.forEach(function (coinType, index, coinTypes) {

            var coin = require('./coins/' + coinType);
            coin.client.listAccounts(function (err, accounts) {
                // Make sure we can connect to client
                if (err) return console.error(err);

                // Lists all the accounts and their balances
                for (var accountName in accounts) {
                    var balance = accounts[accountName];
//                    console.log("Processing: " + accountName + " (" + balance + ")");

                    // Get the account info from database
                    if (balance >= coin.minBalance) {
                        Account.findOne({ 'name': accountName }).exec(function (err, account) {
                            if (err) return console.error(err);

                            // If the account is found in the database
                            if (account !== null) {

                                // Calculate the total hashes for the account
                                var unit_total = _.reduce(account.addresses, function (sum, address) {
                                    return sum + address.units;
                                }, 0);

                                var accountInformation = {
                                    hashes_total: unit_total,
                                    amount_total: accounts[account.name],
                                    usd_btc: usdRate,
                                    fee_period: account.fee_period,
                                    fee_per_unit: account.fee_per_unit
                                };

                                // Calculate each address transaction data (amount, fees, etc)

                                var transaction = {
                                    timestamp: new Date(), // new Date
                                    owner_address: account.owner_address,
                                    total_units: unit_total,
                                    amounts: {}
                                };

                                // Have to add transaction period after generating the timestamp
                                // Get the last transaction timestamp and calculate the difference.
                                // ( subtracting dates gives milliseconds different)
                                // (current time - last transaction time) / (1000 * 60 * 60 * 24) ms to seconds to minutes to hours to days
                                transaction.transaction_period = (transaction.timestamp - account.transactions[account.transactions.length - 1].timestamp) / (1000 * 60 * 60 * 24); // In days

                                // Calculate the account fee
                                var accountFee = amountFloor(unit_total * account.fee_per_unit * (transaction.transaction_period / account.fee_period));

                                var availableBalance = balance - coin.transactionFee - accountFee;
                                account.addresses.forEach(function (address, i, addresses) {
                                    transaction.amounts[address.address] = amountFloor(availableBalance * address.units / unit_total);
                                });

                                // Fees
                                transaction.amounts[transaction.owner_address] = accountFee;

                                // Calculate the amounts total
                                var transfers_total = 0;
                                for (var amount in transaction.amounts) {
                                    transfers_total += transaction.amounts[amount];
                                }

                                if (transfers_total > balance) {
                                    console.error(account.name, "Totals do not match:", transfers_total, accountInformation.amount_total);
                                } else {
                                    coin.client.send(account.name, transaction.amounts, function (transactionId) {
                                        // Record the transaction to database
                                        transaction.id = transactionId;
                                        transaction.save();
                                        console.log(transactionId);
                                    });

                                    console.log(account.name, transaction.amounts);
                                }
//                            console.log(account.name + ': ', accountInformation, '\n');
                            }
                        });
                    }
                }


                setTimeout(function () {
                    process.exit();
                }, 200);
            });
        });
    });
});

// This is the Javascript Math is dumb so we have to improve it area
function amountFloor (value) {
    return Math.floor(1e8 * value) / 1e8;
}

/*
 usdValue(function (btc_usd) {
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

 */
