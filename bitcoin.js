/**
 * Created by jsmith on 12/20/13.
 */

// For connecting to the local bitcoin server
var bitcoin = require('bitcoin');
var client = new bitcoin.Client({
    host: 'localhost',
    port: 8332,
    user: 'bitcoinrpc',
    pass: '4vMTMWyqGKz8xy7EyZ8LDM9s48cHQNwEkzoXWUHcjM6j'
});

// For connecting to coinbase to fetch the spot price
var https = require('https');


function getBlockCount() {
    client.getBlockCount(function(err, blockCount) {
        if (err) {
            return console.error(err);
        }

        console.log('Block Count: ' + blockCount);
        return blockCount;
    });
}

// Lists all the accounts and their balances
function listAccounts() {
    client.listAccounts(function (err, accounts) {
        if (err) {
            return console.error(err);
        }

        console.dir(accounts);
        return accounts;
    });
}

// Create an Address and an Account it returns the Address
// The serverName must be unique to keep the addresses specific to the account
function createAccount(serverName) {
    client.getNewAddress(serverName, function (err, address) {
        if (err) {
            return console.error(err);
        }

        console.dir(address);
        return address;
    });
}

function getAddressByAccount(account) {
    client.getAddressesByAccount(account, function (err, address) {
        if (err) {
            return console.error(err);
        }

        console.dir(address);
        return address;
    });
}

// send from one account to many other accounts
// the transfers should be an object formatted as {address:amount,...}
function send(fromAccount, transfers) {
    client.sendMany(fromAccount, transfers, function (err, result) {
        if (err) {
            return console.error(err);
        }

        console.dir(result);
        return result;
    });
}

function fetchValue(callback) {
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
                    callback(responseObject.last);
                }
            });
        }
    );
    request.on('error', function(e) {
        console.log('Problem with request: ' + e.message);
    });
    request.end();
}