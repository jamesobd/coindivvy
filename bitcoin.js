/**
 * Created by jsmith on 12/20/13.
 */
var bitcoin = require('bitcoin');
var client = new bitcoin.Client({
    host: 'localhost',
    port: 8332,
    user: 'bitcoinrpc',
    pass: '4vMTMWyqGKz8xy7EyZ8LDM9s48cHQNwEkzoXWUHcjM6j'
});

client.getBlockCount(function(err, blockCount) {
    if (err) {
        return console.error(err);
    }

    console.log('Block Count: ' + blockCount);
    //createAccount('Some Server Name');
    listAccounts();
    send('Some Server Name', {"1KcJ93pNYPvE5G338aWTLTKhr7TobgbtBP": 0.0001})
    getAddressByAccount('alpha');
});

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