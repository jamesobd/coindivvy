var https = require('https');
var mongoose = require('mongoose');
var _ = require('underscore');
var exchanges = require('./libraries/exchanges');

// Load Models
//mongoose.connect(process.env.COINDIVVY_DB_HOST);
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
                if (err) {
                    if (err.code = 'ECONNREFUSED') {
                        console.error('Unable to connect to the Bitcoin Daemon');
                    } else {
                        console.error('What the heck just happened?  Bitcoin Daemon doesn\'t like us');
                    }
                    process.exit();
                }

                for (var accountName in accounts) {
                    (function (balance) {
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
                                        timestamp: new Date(),
                                        fee_address: account.fee_address,
                                        total_units: unit_total,
                                        amounts: {}
                                    };

                                    // Have to add transaction period after generating the timestamp
                                    // Get the last transaction timestamp and calculate the difference.
                                    // ( subtracting dates gives milliseconds different)
                                    // (current time - last transaction time) / (1000 * 60 * 60 * 24) ms to seconds to minutes to hours to days
                                    if (account.last_transaction_date === undefined) {
                                        var transactionPeriod = 0;
                                    } else {
                                        var transactionPeriod = (transaction.timestamp - account.last_transaction_date) / (1000 * 60 * 60 * 24); // In days
                                    }


                                    // Calculate the account fee
                                    var accountFee = amountFloor(unit_total * account.fee_per_unit * (transactionPeriod / account.fee_period) / usdRate);

                                    var availableBalance = balance - coin.transactionFee - accountFee;
                                    account.addresses.forEach(function (address, i, addresses) {
                                        transaction.amounts[address.address] = amountFloor(availableBalance * address.units / unit_total);
                                    });

                                    // Add account fees
                                    if (accountFee >= coin.minAccountFee) {
                                        transaction.amounts[transaction.fee_address] = accountFee;
                                    }

                                    // Calculate the amounts total
                                    var transfers_total = 0;
                                    for (var amount in transaction.amounts) {
                                        transfers_total += transaction.amounts[amount];
                                    }

                                    if (transfers_total > balance - coin.transactionFee || availableBalance <= 0) {
                                        console.error(account.name, "Not enough funds or totals do not match:", transfers_total, accountInformation.amount_total);
                                    } else {
                                        coin.client.walletPassphrase(coin.passphrase, 10, function (response) {
                                            //should do some error handling though -15 "wallet already unlocked" should be treated as success
                                            console.log(response);
                                            coin.client.sendMany(account.name, transaction.amounts, function (err, transactionId) {
                                                if (err) return console.error(err);

                                                // Record the transaction to database
                                                transaction._id = transactionId;
                                                account.transactions.push(transaction);
                                                account.last_transaction_date = transaction.timestamp;
                                                account.save(function (err) {
                                                    if (err) return console.error(err);
                                                    console.log('Successfully saved transaction ' + transactionId);
                                                });

                                                // Should probably do some sort of promise so that we unlock the wallet before doing everything
                                                // and then when we are done with all of the accounts we should lock the wallet again.
                                                coin.client.walletLock();
                                            });
                                        });

                                        console.log(account.name, transaction.amounts);
                                    }
//                            console.log(account.name + ': ', accountInformation, '\n');
                                }
                            });
                        }
                    })(accounts[accountName])
                }


//                setTimeout(function () {
//                    process.exit();
//                }, 200);
            });
        });
    });
});

// This is the Javascript Math is dumb so we have to improve it area
function amountFloor(value) {
    return Math.floor(1e8 * value) / 1e8;
}
