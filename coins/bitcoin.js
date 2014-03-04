/**
 * Created by jsmith on 12/20/13.
 */

var https = require('https');
var bitcoin = require('bitcoin');
var _ = require('underscore');

// Create bitcoin client instance
var client = new bitcoin.Client({
    host: 'localhost',
    port: 8332,
    user: '0MNdueMvHGoZs1zNqHLvYMKFm3dB2zC5ATa',
    pass: '7m9FoCAg11w4KV4YZYMKxscEf9wLSPjUL2NuSNeGK5zx'
});

module.exports.client = client;
module.exports.minBalance = .0004; // TODO: Change this back to .1
module.exports.minAccountFee = .0001;
module.exports.transactionFee = .0001; // TODO: Get this value from bitcoind
module.exports.passphrase = '5DcQ15hHEjS9diQ6mpnPRVQqmIGZ5';


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
